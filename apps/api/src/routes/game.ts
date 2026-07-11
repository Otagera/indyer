import { Hono } from "hono";
import { eq, and, sql } from "drizzle-orm";
import { getClient } from "../db/client.js";
import { subjects, clues, puzzles, gameStates } from "@indyer/db/schema";
import { getSubjectForDate, getIssueNo } from "@indyer/db/puzzle-selector";
import { MODE_CLUE_COUNTS } from "@indyer/shared";
import { fuzzyMatch } from "../lib/fuzzy.js";
import type { Mode, TodayResponse, StartResponse, GuessResponse, ClueItem } from "@indyer/shared";

const game = new Hono();

function dbGuard(c: any) {
  return getClient();
}

async function resolveToday(db: NonNullable<ReturnType<typeof getClient>>) {
  const today = new Date();
  const issueNo = getIssueNo(today);

  const allSubjects = await db.select({ id: subjects.id, active: subjects.active }).from(subjects);
  const subjectId = getSubjectForDate(allSubjects, today);
  if (!subjectId) throw new Error("No active subjects");

  const [existing] = await db.select().from(puzzles).where(eq(puzzles.issueNo, issueNo)).limit(1);

  if (!existing) {
    await db.insert(puzzles).values({ issueNo, subjectId, date: today });
  }

  const sid = existing ? existing.subjectId : subjectId;

  return { issueNo, subjectId: sid };
}

function getClueBudget(mode: Mode): number {
  return MODE_CLUE_COUNTS[mode];
}

function clampCluesRevealed(cluesRevealed: number, budget: number): number {
  return Math.min(cluesRevealed, budget);
}

game.get("/today", async (c) => {
  const db = dbGuard(c);
  if (!db) return c.json({ error: "Database not available", code: "DB_UNAVAILABLE" }, 503);

  const pid = c.get("playerId");
  const { issueNo } = await resolveToday(db);

  const [gs] = await db
    .select()
    .from(gameStates)
    .where(and(eq(gameStates.playerId, pid), eq(gameStates.issueNo, issueNo)))
    .limit(1);

  if (!gs) {
    const response: TodayResponse = {
      issueNo,
      date: new Date().toISOString(),
      status: "new",
      totalClues: 6,
      availableModes: ["easy", "normal", "hard"],
    };
    return c.json(response);
  }

  const budget = getClueBudget(gs.mode as Mode);
  const cluesRevealed = clampCluesRevealed(gs.cluesRevealed, budget);

  const currentClues: ClueItem[] = [];

  if (cluesRevealed > 0) {
    const [puzzle] = await db
      .select({ subjectId: puzzles.subjectId })
      .from(puzzles)
      .where(eq(puzzles.issueNo, issueNo))
      .limit(1);

    const clueRows = await db
      .select({ number: clues.order, text: clues.text, axis: clues.axis })
      .from(clues)
      .where(eq(clues.subjectId, puzzle.subjectId))
      .orderBy(clues.order)
      .limit(cluesRevealed);

    currentClues.push(...clueRows);
  }

  const guesses = gs.guesses as { text: string; correct: boolean; timestamp: string }[];
  const status = gs.solved ? "solved"
    : guesses.length >= 6 ? "failed"
    : "started";

  const response: TodayResponse = {
    issueNo,
    date: new Date().toISOString(),
    status,
    totalClues: 6,
    mode: gs.mode as Mode,
    clues: currentClues,
    guesses,
    cluesShown: cluesRevealed,
  };

  if (status === "solved" || status === "failed") {
    const [puzzle] = await db
      .select({ subjectId: puzzles.subjectId })
      .from(puzzles)
      .where(eq(puzzles.issueNo, issueNo))
      .limit(1);
    const [subject] = await db
      .select({ name: subjects.name })
      .from(subjects)
      .where(eq(subjects.id, puzzle.subjectId))
      .limit(1);
    response.subjectName = subject.name;
  }

  return c.json(response);
});

game.post("/start", async (c) => {
  const db = dbGuard(c);
  if (!db) return c.json({ error: "Database not available", code: "DB_UNAVAILABLE" }, 503);

  const pid = c.get("playerId");
  const { mode } = await c.req.json<{ mode: Mode }>();

  if (!["easy", "normal", "hard"].includes(mode)) {
    return c.json({ error: "Invalid mode", code: "INVALID_MODE" }, 400);
  }

  const { issueNo, subjectId } = await resolveToday(db);

  const [existing] = await db
    .select()
    .from(gameStates)
    .where(and(eq(gameStates.playerId, pid), eq(gameStates.issueNo, issueNo)))
    .limit(1);

  if (existing) {
    return c.json({ error: "Already started today", code: "ALREADY_STARTED" }, 409);
  }

  await db.insert(gameStates).values({
    playerId: pid,
    issueNo,
    mode,
    guesses: [],
    cluesRevealed: 1,
    solved: false,
  });

  const [firstClue] = await db
    .select({ number: clues.order, text: clues.text, axis: clues.axis })
    .from(clues)
    .where(eq(clues.subjectId, subjectId))
    .orderBy(clues.order)
    .limit(1);

  const response: StartResponse = {
    issueNo,
    mode,
    clue: firstClue,
    cluesShown: 1,
    totalClues: 6,
    guessesLeft: 6,
  };

  return c.json(response);
});

game.post("/guess", async (c) => {
  const db = dbGuard(c);
  if (!db) return c.json({ error: "Database not available", code: "DB_UNAVAILABLE" }, 503);

  const pid = c.get("playerId");
  const { text } = await c.req.json<{ text: string }>();

  if (!text || text.trim().length === 0) {
    return c.json({ error: "Guess cannot be empty", code: "EMPTY_GUESS" }, 400);
  }

  const { issueNo, subjectId } = await resolveToday(db);

  const [gs] = await db
    .select()
    .from(gameStates)
    .where(and(eq(gameStates.playerId, pid), eq(gameStates.issueNo, issueNo)))
    .limit(1);

  if (!gs) {
    return c.json({ error: "Game not started", code: "NOT_STARTED" }, 400);
  }

  const currentGuesses = gs.guesses as { text: string; correct: boolean; timestamp: string }[];

  if (gs.solved) {
    return c.json({ error: "Already solved", code: "ALREADY_SOLVED" }, 400);
  }

  if (currentGuesses.length >= 6) {
    return c.json({ error: "No guesses remaining", code: "NO_GUESSES_LEFT" }, 400);
  }

  const [subject] = await db
    .select({ name: subjects.name, acceptedAnswers: subjects.acceptedAnswers })
    .from(subjects)
    .where(eq(subjects.id, subjectId))
    .limit(1);

  const correct = fuzzyMatch(text, subject.acceptedAnswers);
  const mode = gs.mode as Mode;
  const budget = getClueBudget(mode);

  const guess = {
    text: text.trim(),
    correct,
    timestamp: new Date().toISOString(),
  };

  const updatedGuesses = [...currentGuesses, guess];
  const attemptsUsed = updatedGuesses.length;
  const guessesLeft = 6 - attemptsUsed;
  const gameOver = correct || attemptsUsed >= 6;

  let cluesRevealed = gs.cluesRevealed;
  let nextClue: ClueItem | null = null;

  if (!correct && cluesRevealed < budget) {
    cluesRevealed++;

    const [clueRow] = await db
      .select({ number: clues.order, text: clues.text, axis: clues.axis })
      .from(clues)
      .where(eq(clues.subjectId, subjectId))
      .orderBy(clues.order)
      .offset(cluesRevealed - 1)
      .limit(1);

    if (clueRow) {
      nextClue = clueRow;
    }
  }

  if (correct) {
    nextClue = null;
  }

  await db
    .update(gameStates)
    .set({
      guesses: updatedGuesses,
      cluesRevealed,
      solved: correct || gs.solved,
      updatedAt: sql`now()`,
    })
    .where(eq(gameStates.id, gs.id));

  const response: GuessResponse = {
    correct,
    nextClue,
    guessesLeft,
    gameOver,
    ...(gameOver ? { answer: subject.name } : {}),
  };

  return c.json(response);
});

export { game };
