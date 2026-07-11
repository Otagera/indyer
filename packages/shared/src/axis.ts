export type Axis = "origin" | "work" | "place" | "contemporary" | "epithet" | "end";

export const AXES: Axis[] = ["origin", "work", "place", "contemporary", "epithet", "end"];

export const MODE_CLUE_COUNTS: Record<import("./subject.ts").Mode, number> = {
  easy: 6,
  normal: 4,
  hard: 2,
};
