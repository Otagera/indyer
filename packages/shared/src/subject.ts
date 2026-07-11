import type { Axis } from "./axis.ts";

export type Mode = "easy" | "normal" | "hard";

export type Category = "leader" | "musician" | "footballer" | "writer" | "coup_plotter" | "regional_leader" | "other";

export interface Subject {
  id: number;
  name: string;
  acceptedAnswers: string[];
  category: Category;
  era: string;
  active: boolean;
}

export interface Clue {
  id: number;
  subjectId: number;
  axis: Axis;
  text: string;
  source: ClueSource | null;
  order: number;
}

export interface ClueSource {
  publication?: string;
  date?: string;
  page?: string;
  permalink?: string;
  imageUrl?: string;
}
