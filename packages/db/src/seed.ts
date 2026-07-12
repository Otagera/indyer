import { createClient } from "./client.ts";
import roster from "./roster.json" with { type: "json" };
import { clues, puzzles, subjects } from "./schema.ts";

const dbUrl = process.env.DATABASE_URL ?? "postgres://localhost:5432/indyer";
const db = createClient(dbUrl);

async function seed() {
  // Boot-time guard: with SEED_IF_EMPTY set, never touch a database that
  // already has a roster — a full seed wipes puzzles and re-rolls today's
  // subject under live players
  if (process.env.SEED_IF_EMPTY) {
    const existing = await db.select({ id: subjects.id }).from(subjects).limit(1);
    if (existing.length > 0) {
      console.log("Roster already present — skipping seed (SEED_IF_EMPTY)");
      process.exit(0);
    }
  }

  console.log("Seeding database...\n");

  // Idempotent: wipe roster tables (FK order) so reruns don't duplicate subjects
  await db.delete(clues);
  await db.delete(puzzles);
  await db.delete(subjects);
  console.log("  cleared clues, puzzles, subjects\n");

  for (const entry of roster) {
    if (entry.weak && entry.weak.length > 0) {
      console.warn(`⚠  ${entry.name} — weak axes: ${entry.weak.join(", ")}`);
    }

    const [subject] = await db
      .insert(subjects)
      .values({
        name: entry.name,
        acceptedAnswers: entry.acceptedAnswers,
        category: entry.category,
        era: entry.era,
      })
      .returning({ id: subjects.id, name: subjects.name });

    const clueValues = entry.clues.map((c) => ({
      subjectId: subject.id,
      axis: c.axis,
      text: c.text,
      order: c.order,
      source: (c as any).source ?? null,
    }));

    await db.insert(clues).values(clueValues);
    console.log(`  ✓ ${subject.name} — ${subject.id}`);
  }

  console.log("\nSeeding complete");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
