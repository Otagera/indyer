import { mulberry32, hashSeed } from "@indyer/shared";

const BASE_SEED = 42;

export function getSubjectForDate(
  subjects: { id: number; active: boolean }[],
  date: Date,
): number | null {
  const active = subjects.filter((s) => s.active);
  if (active.length === 0) return null;

  const dateStr = date.toISOString().slice(0, 10);
  const seed = hashSeed(BASE_SEED, dateStr);
  const rng = mulberry32(seed);

  const ids = active.map((s) => s.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }

  const epochDays = Math.floor(date.getTime() / 86400000);
  return ids[epochDays % ids.length];
}

export function getIssueNo(date: Date): number {
  const launchDate = new Date("2026-07-11");
  const diffMs = date.getTime() - launchDate.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  return diffDays + 1;
}
