import { createClient } from "./client.ts";

const dbUrl = process.env.DATABASE_URL ?? "postgres://localhost:5432/indyer";
const db = createClient(dbUrl);

async function seed() {
  console.log("Seeding database...");
  // TODO: IND-1 — seed subjects and puzzles
  console.log("Seeding complete");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
