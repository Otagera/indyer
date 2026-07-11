import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { getClient } from "../db/client.js";
import { playerIdentities, authCodes } from "@indyer/db/schema";
import { config } from "../config.js";
import { buildMagicLinkEmail } from "../lib/email-template.js";
import type { MagicLinkResponse, VerifyResponse } from "@indyer/shared";
import crypto from "node:crypto";

const auth = new Hono();

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += " ";
    code += chars[crypto.randomInt(chars.length)];
  }
  return code;
}

auth.post("/magic-link", async (c) => {
  const db = getClient();
  if (!db) {
    return c.json({ error: "Database not available", code: "DB_UNAVAILABLE" }, 503);
  }

  const { email } = await c.req.json<{ email: string }>();
  if (!email || !email.includes("@")) {
    return c.json({ error: "Invalid email", code: "INVALID_EMAIL" }, 400);
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db.insert(authCodes).values({ email, code, expiresAt });

  if (config.nodeEnv === "development") {
    console.log(`[MAGIC LINK] Code for ${email}: ${code}`);
  } else {
    const { Resend } = await import("resend");
    const resend = new Resend(config.resendApiKey);
    const { subject, html } = buildMagicLinkEmail(code);
    await resend.emails.send({
      from: "Indyer <noreply@indyer.otagera.xyz>",
      to: email,
      subject,
      html,
    });
  }

  const response: MagicLinkResponse = { sent: true };
  return c.json(response);
});

auth.post("/verify", async (c) => {
  const db = getClient();
  if (!db) {
    return c.json({ error: "Database not available", code: "DB_UNAVAILABLE" }, 503);
  }

  const pid = c.get("playerId");
  const { email, code: rawCode } = await c.req.json<{ email: string; code: string }>();
  const code = rawCode.toUpperCase().replace(/\s/g, "");

  const [stored] = await db
    .select()
    .from(authCodes)
    .where(eq(authCodes.email, email))
    .orderBy(authCodes.createdAt)
    .limit(1);

  if (!stored || stored.used || new Date() > stored.expiresAt || stored.code.replace(/\s/g, "") !== code) {
    return c.json({ error: "Invalid or expired code", code: "INVALID_CODE" }, 400);
  }

  await db.update(authCodes).set({ used: true }).where(eq(authCodes.id, stored.id));

  const existing = await db
    .select()
    .from(playerIdentities)
    .where(eq(playerIdentities.email, email))
    .limit(1);

  const isNew = !existing.length;

  if (existing.length > 0) {
    await db
      .update(playerIdentities)
      .set({ playerId: pid })
      .where(eq(playerIdentities.email, email));
  } else {
    await db.insert(playerIdentities).values({ playerId: pid, email });
  }

  const response: VerifyResponse = { ok: true, isNew };
  return c.json(response);
});

export { auth };
