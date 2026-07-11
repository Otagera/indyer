import type { MiddlewareHandler } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import crypto from "node:crypto";

declare module "hono" {
  interface ContextVariableMap {
    playerId: string;
  }
}

export const identity: MiddlewareHandler = async (c, next) => {
  let pid = getCookie(c, "indyer_pid");

  if (!pid) {
    pid = crypto.randomUUID();
    setCookie(c, "indyer_pid", pid, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
    });
  }

  c.set("playerId", pid);
  await next();
};
