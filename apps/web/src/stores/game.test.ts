import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGameStore } from "./game";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
  useGameStore.setState({
    screen: "loading",
    today: null,
    error: null,
    issueNo: 0,
    mode: null,
    clues: [],
    guesses: [],
    totalClues: 6,
    cluesShown: 0,
    answer: null,
    category: null,
    allClues: [],
    roster: [],
  });
});

describe("game store", () => {
  describe("load", () => {
    it("transitions to mode-select when status is new", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          issueNo: 5,
          date: "2026-07-15",
          status: "new",
          totalClues: 6,
          availableModes: ["easy", "normal", "hard"],
          roster: ["Subject A", "Subject B"],
        }),
      });

      await useGameStore.getState().load();
      const state = useGameStore.getState();
      expect(state.screen).toBe("mode-select");
      expect(state.issueNo).toBe(5);
    });

    it("transitions to playing when status is started", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          issueNo: 5,
          date: "2026-07-15",
          status: "started",
          totalClues: 6,
          mode: "normal",
          clues: [{ number: 1, text: "First clue", axis: "origin" }],
          guesses: [{ text: "wrong", correct: false, timestamp: new Date().toISOString() }],
          cluesShown: 1,
          roster: ["Subject A"],
        }),
      });

      await useGameStore.getState().load();
      const state = useGameStore.getState();
      expect(state.screen).toBe("playing");
      expect(state.mode).toBe("normal");
      expect(state.clues).toHaveLength(1);
      expect(state.guesses).toHaveLength(1);
    });

    it("transitions to solved when status is solved", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          issueNo: 5,
          date: "2026-07-15",
          status: "solved",
          totalClues: 6,
          mode: "easy",
          clues: [{ number: 1, text: "First clue", axis: "origin" }],
          guesses: [{ text: "correct answer", correct: true, timestamp: new Date().toISOString() }],
          cluesShown: 1,
          subjectName: "Test Subject",
          category: "writer",
          allClues: [
            { number: 1, text: "First clue", axis: "origin" },
            { number: 2, text: "Second clue", axis: "work" },
          ],
          roster: ["Test Subject"],
        }),
      });

      await useGameStore.getState().load();
      const state = useGameStore.getState();
      expect(state.screen).toBe("solved");
      expect(state.answer).toBe("Test Subject");
      expect(state.category).toBe("writer");
      expect(state.allClues).toHaveLength(2);
    });

    it("transitions to failed when status is failed", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          issueNo: 5,
          status: "failed",
          totalClues: 6,
          mode: "hard",
          clues: [],
          guesses: Array.from({ length: 6 }, (_, i) => ({
            text: `guess ${i}`,
            correct: false,
            timestamp: new Date().toISOString(),
          })),
          cluesShown: 2,
          subjectName: "Test Subject",
          category: "leader",
          allClues: [],
          roster: [],
        }),
      });

      await useGameStore.getState().load();
      const state = useGameStore.getState();
      expect(state.screen).toBe("failed");
      expect(state.answer).toBe("Test Subject");
    });

    it("handles fetch error gracefully", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await useGameStore.getState().load();
      const state = useGameStore.getState();
      expect(state.error).toBe("Network error");
      expect(state.screen).toBe("mode-select");
    });

    it("handles non-ok response", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      await useGameStore.getState().load();
      const state = useGameStore.getState();
      expect(state.error).toBe("HTTP 500");
    });
  });

  describe("startGame", () => {
    it("transitions to playing with first clue", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          issueNo: 5,
          mode: "hard",
          clue: { number: 1, text: "First clue", axis: "origin" },
          cluesShown: 1,
          totalClues: 6,
          guessesLeft: 6,
        }),
      });

      await useGameStore.getState().startGame("hard");
      const state = useGameStore.getState();
      expect(state.screen).toBe("playing");
      expect(state.mode).toBe("hard");
      expect(state.clues).toHaveLength(1);
      expect(state.clues[0].number).toBe(1);
    });

    it("handles error from API", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ error: "Already started today", code: "ALREADY_STARTED" }),
      });

      await useGameStore.getState().startGame("easy");
      const state = useGameStore.getState();
      expect(state.error).toBe("Already started today");
    });
  });

  describe("submitGuess", () => {
    it("correct guess transitions to solved", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          correct: true,
          nextClue: null,
          guessesLeft: 5,
          gameOver: true,
          answer: "Test Subject",
          category: "musician",
          allClues: [{ number: 1, text: "First clue", axis: "origin" }],
        }),
      });

      useGameStore.setState({
        clues: [{ number: 1, text: "First clue", axis: "origin" }],
        cluesShown: 1,
        guesses: [],
        mode: "easy",
      });

      const result = await useGameStore.getState().submitGuess("Test Subject");
      const state = useGameStore.getState();
      expect(state.screen).toBe("solved");
      expect(state.answer).toBe("Test Subject");
      expect(state.category).toBe("musician");
      expect(state.guesses).toHaveLength(1);
      expect(state.guesses[0].correct).toBe(true);
      expect(result?.correct).toBe(true);
    });

    it("incorrect guess stays on playing screen", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          correct: false,
          nextClue: { number: 2, text: "Second clue", axis: "work" },
          guessesLeft: 5,
          gameOver: false,
        }),
      });

      useGameStore.setState({
        screen: "playing",
        clues: [{ number: 1, text: "First clue", axis: "origin" }],
        cluesShown: 1,
        guesses: [],
        mode: "normal",
      });

      await useGameStore.getState().submitGuess("Wrong");
      const state = useGameStore.getState();
      expect(state.screen).toBe("playing");
      expect(state.guesses).toHaveLength(1);
      expect(state.guesses[0].correct).toBe(false);
      expect(state.clues).toHaveLength(2);
    });

    it("final wrong guess transitions to failed", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          correct: false,
          nextClue: null,
          guessesLeft: 0,
          gameOver: true,
          answer: "Test Subject",
          allClues: [],
        }),
      });

      useGameStore.setState({
        clues: [{ number: 1, text: "First clue", axis: "origin" }],
        cluesShown: 1,
        guesses: Array.from({ length: 5 }, (_, i) => ({
          text: `guess ${i}`,
          correct: false,
          timestamp: new Date().toISOString(),
        })),
        mode: "hard",
      });

      await useGameStore.getState().submitGuess("Final wrong guess");
      const state = useGameStore.getState();
      expect(state.screen).toBe("failed");
      expect(state.answer).toBe("Test Subject");
      expect(state.guesses).toHaveLength(6);
    });

    it("handles API error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Game not started", code: "NOT_STARTED" }),
      });

      useGameStore.setState({ mode: "easy", guesses: [] });
      const result = await useGameStore.getState().submitGuess("anything");
      const state = useGameStore.getState();
      expect(state.error).toBe("Game not started");
      expect(result).toBeNull();
    });
  });
});
