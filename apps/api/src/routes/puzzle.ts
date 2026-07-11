import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { getClient } from "../db/client.js";
import { subjects, clues, puzzles } from "@indyer/db/schema";
import { getSubjectForDate, getIssueNo } from "@indyer/db/puzzle-selector";


const puzzle = new Hono();

puzzle.get("/today", async (c) => {
  const db = getClient();
  if (!db) {
    return c.json({ error: "Database not available", code: "DB_UNAVAILABLE" }, 503);
  }

  const today = new Date();
  const issueNo = getIssueNo(today);

  const allSubjects = await db.select({ id: subjects.id, active: subjects.active }).from(subjects);
  const subjectId = getSubjectForDate(allSubjects, today);
  if (!subjectId) {
    return c.json({ error: "No active subjects", code: "NO_SUBJECTS" }, 500);
  }

  const existing = await db.select().from(puzzles).where(eq(puzzles.issueNo, issueNo)).limit(1);

  if (existing.length === 0) {
    await db.insert(puzzles).values({
      issueNo,
      subjectId,
      date: today,
    });
  }

  const [subject] = await db
    .select({
      name: subjects.name,
      category: subjects.category,
      era: subjects.era,
    })
    .from(subjects)
    .where(eq(subjects.id, subjectId))
    .limit(1);

  const clueRows = await db
    .select({ axis: clues.axis, text: clues.text, order: clues.order })
    .from(clues)
    .where(eq(clues.subjectId, subjectId))
    .orderBy(clues.order);

  const response = {
    issueNo,
    subject,
    clues: clueRows,
    cluesShown: 0,
    totalClues: clueRows.length,
    mode: null,
    modeLocked: false,
  };

  return c.json(response);
});

export { puzzle };
