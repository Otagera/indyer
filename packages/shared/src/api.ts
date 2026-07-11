import type { Guess, PlayerState } from "./puzzle.ts";
import type { Mode, Subject } from "./subject.ts";

export interface HealthResponse {
  status: "ok" | "error";
  db: "connected" | "disconnected" | "error";
  uptime: number;
}

export interface TodayPuzzleResponse {
  issueNo: number;
  category: string;
  dek: string;
  cluesShown: number;
  totalClues: number;
  mode: Mode | null;
  modeLocked: boolean;
  guesses: Guess[];
  solved: boolean;
  subjectName?: string;
}

export interface SetModeRequest {
  mode: Mode;
}

export interface SetModeResponse {
  mode: Mode;
  locked: boolean;
}

export interface SubmitGuessRequest {
  guess: string;
}

export interface SubmitGuessResponse {
  correct: boolean;
  guesses: Guess[];
  solved: boolean;
  cluesShown: number;
}

export interface PuzzleAnswerResponse {
  issueNo: number;
  subject: Subject;
  clues: {
    number: number;
    text: string;
    seen: boolean;
  }[];
  solved: boolean;
  guessCount: number;
}

export interface ApiError {
  error: string;
  code: string;
}
