import type { Guess } from "./puzzle.ts";
import type { Mode, ClueSource } from "./subject.ts";

export interface HealthResponse {
  status: "ok" | "error";
  db: "connected" | "disconnected" | "error";
  uptime: number;
}

export interface ApiError {
  error: string;
  code: string;
}

export interface MagicLinkRequest {
  email: string;
}

export interface MagicLinkResponse {
  sent: boolean;
}

export interface VerifyRequest {
  email: string;
  code: string;
}

export interface VerifyResponse {
  ok: boolean;
  isNew: boolean;
}

export interface ClueItem {
  number: number;
  text: string;
  axis: string;
  source?: ClueSource | null;
}

export interface TodayResponse {
  issueNo: number;
  date: string;
  status: "new" | "started" | "solved" | "failed";
  totalClues: number;
  mode?: Mode;
  availableModes?: Mode[];
  clues?: ClueItem[];
  guesses?: Guess[];
  cluesShown?: number;
  subjectName?: string;
  category?: string;
  allClues?: ClueItem[];
}

export interface StartRequest {
  mode: Mode;
}

export interface StartResponse {
  issueNo: number;
  mode: Mode;
  clue: ClueItem;
  cluesShown: number;
  totalClues: number;
  guessesLeft: number;
}

export interface GuessRequest {
  text: string;
}

export interface GuessResponse {
  correct: boolean;
  nextClue: ClueItem | null;
  guessesLeft: number;
  gameOver: boolean;
  answer?: string;
  category?: string;
  allClues?: ClueItem[];
}
