import type {
  TodayResponse,
  StartResponse,
  GuessResponse,
  Mode,
  ClueItem,
} from "@indyer/shared";
import { create } from "zustand";

export type Screen = "loading" | "mode-select" | "playing" | "solved" | "failed";

interface GuessEntry {
  text: string;
  correct: boolean;
  timestamp: string;
}

interface GameState {
  screen: Screen;
  today: TodayResponse | null;
  error: string | null;
  issueNo: number;
  mode: Mode | null;
  clues: ClueItem[];
  guesses: GuessEntry[];
  totalClues: number;
  cluesShown: number;

  load: () => Promise<void>;
  startGame: (mode: Mode) => Promise<void>;
  submitGuess: (text: string) => Promise<GuessResponse | null>;
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: "loading",
  today: null,
  error: null,
  issueNo: 0,
  mode: null,
  clues: [],
  guesses: [],
  totalClues: 6,
  cluesShown: 0,

  load: async () => {
    set({ screen: "loading", error: null });
    try {
      const res = await fetch("/api/game/today", { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const today: TodayResponse = await res.json();

      if (today.status === "new") {
        set({ screen: "mode-select", today, issueNo: today.issueNo, totalClues: today.totalClues });
      } else {
        set({
          screen: today.status === "solved" ? "solved" : today.status === "failed" ? "failed" : "playing",
          today,
          issueNo: today.issueNo,
          mode: today.mode ?? null,
          clues: today.clues ?? [],
          guesses: today.guesses ?? [],
          totalClues: today.totalClues,
          cluesShown: today.cluesShown ?? 0,
        });
      }
    } catch (e) {
      set({ screen: "mode-select", error: (e as Error).message, today: null });
    }
  },

  startGame: async (mode: Mode) => {
    set({ error: null });
    try {
      const res = await fetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mode }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      const data: StartResponse = await res.json();
      set({
        screen: "playing",
        mode: data.mode,
        clues: [data.clue],
        guesses: [],
        issueNo: data.issueNo,
        totalClues: data.totalClues,
        cluesShown: data.cluesShown,
      });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  submitGuess: async (text: string) => {
    set({ error: null });
    try {
      const res = await fetch("/api/game/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      const data: GuessResponse = await res.json();
      const state = get();

      const newGuess: GuessEntry = {
        text,
        correct: data.correct,
        timestamp: new Date().toISOString(),
      };

      const newGuesses = [...state.guesses, newGuess];
      const newClues = data.nextClue ? [...state.clues, data.nextClue] : state.clues;

      if (data.gameOver) {
        set({
          guesses: newGuesses,
          clues: newClues,
          cluesShown: newClues.length,
          screen: data.correct ? "solved" : "failed",
        });
      } else {
        set({
          guesses: newGuesses,
          clues: newClues,
          cluesShown: newClues.length,
        });
      }

      return data;
    } catch (e) {
      set({ error: (e as Error).message });
      return null;
    }
  },
}));
