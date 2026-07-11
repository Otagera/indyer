import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { getClient } from "../db/client.js";
import { generateShareCardSvg } from "../lib/share-card.js";
import { subjects, clues, puzzles, gameStates } from "@indyer/db/schema";
import { getSubjectForDate, getIssueNo } from "@indyer/db/puzzle-selector";
import type { Mode } from "@indyer/shared";
import { Resvg } from "@resvg/resvg-js";

const share = new Hono();

share.get("/card", async (c) => {
  const db = getClient();
  if (!db) return c.json({ error: "Database not available", code: "DB_UNAVAILABLE" }, 503);

  const pid = c.get("playerId");
  if (!pid) return c.json({ error: "No player identity", code: "NO_IDENTITY" }, 401);

  const today = new Date();
  const issueNo = getIssueNo(today);

  const allSubjects = await db.select({ id: subjects.id, active: subjects.active }).from(subjects);
  const subjectId = getSubjectForDate(allSubjects, today);
  if (!subjectId) return c.json({ error: "No active subjects", code: "NO_SUBJECTS" }, 500);

  const [gs] = await db
    .select()
    .from(gameStates)
    .where(and(eq(gameStates.playerId, pid), eq(gameStates.issueNo, issueNo)))
    .limit(1);

  if (!gs) return c.json({ error: "No game state", code: "NO_GAME" }, 400);

  const guesses = gs.guesses as { text: string; correct: boolean; timestamp: string }[];
  const usedGuesses = guesses.length;
  const totalGuesses = 6;
  const mode = (gs.mode ?? "easy") as Mode;

  const [puzzleRow] = await db
    .select({ subjectId: puzzles.subjectId })
    .from(puzzles)
    .where(eq(puzzles.issueNo, issueNo))
    .limit(1);

  const sid = puzzleRow?.subjectId ?? subjectId;

  const [firstClue] = await db
    .select({ text: clues.text })
    .from(clues)
    .where(eq(clues.subjectId, sid))
    .orderBy(clues.order)
    .limit(1);

  const clueText = firstClue?.text ?? "A Nigerian notable to identify.";

  const svg = generateShareCardSvg({
    issueNo,
    mode,
    usedGuesses,
    totalGuesses,
    clueText,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const png = resvg.render();
  const pngBuffer = png.asPng();

  return c.newResponse(new Uint8Array(pngBuffer), 200, {
    "Content-Type": "image/png",
    "Cache-Control": "public, max-age=60",
  });
});

export { share };
