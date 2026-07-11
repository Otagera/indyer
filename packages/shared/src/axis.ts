export type Axis = "career" | "region" | "era" | "achievement" | "personal" | "notability";

export const MODE_CLUE_COUNTS: Record<import("./subject.ts").Mode, number> = {
  easy: 6,
  normal: 4,
  hard: 2,
};
