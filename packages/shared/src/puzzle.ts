import type { Clue, Mode, Subject } from "./subject.ts";

export interface DailyIssue {
  issueNo: number;
  date: string;
  subject: Subject;
  clues: Clue[];
  category: string;
  dek: string;
}

export interface Guess {
  text: string;
  correct: boolean;
  timestamp: string;
}

export interface PlayerState {
  issueNo: number;
  mode: Mode | null;
  modeLocked: boolean;
  guesses: Guess[];
  solved: boolean;
}

export interface GameState {
  issue: DailyIssue;
  player: PlayerState;
}
