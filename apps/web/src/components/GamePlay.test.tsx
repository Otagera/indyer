import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GamePlay } from "./GamePlay";
import { useGameStore } from "../stores/game";

vi.mock("../stores/game", () => ({
  useGameStore: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GamePlay", () => {
  it("shows guess dots and clues", () => {
    (useGameStore as any).mockReturnValue({
      clues: [{ number: 1, text: "Born in Jos", axis: "place" }],
      guesses: [{ text: "Wrong guess", correct: false, timestamp: "2026-01-01" }],
      mode: "normal",
      totalClues: 6,
      submitGuess: vi.fn(),
      error: null,
      roster: [],
    });

    render(<GamePlay />);

    expect(screen.getByText("Born in Jos")).toBeInTheDocument();
    expect(screen.getByText("Wrong guess")).toBeInTheDocument();
    expect(screen.getByText("FILE IT")).toBeInTheDocument();
  });

  it("shows remaining guess count", () => {
    (useGameStore as any).mockReturnValue({
      clues: [],
      guesses: [{ text: "Wrong", correct: false, timestamp: "2026-01-01" }],
      mode: "easy",
      totalClues: 6,
      submitGuess: vi.fn(),
      error: null,
      roster: [],
    });

    render(<GamePlay />);
    expect(screen.getByText("5 guesses remaining")).toBeInTheDocument();
  });

  it("shows clue-exhausted message on Normal mode when budget spent", () => {
    (useGameStore as any).mockReturnValue({
      clues: [
        { number: 1, text: "C1", axis: "origin" },
        { number: 2, text: "C2", axis: "work" },
        { number: 3, text: "C3", axis: "place" },
        { number: 4, text: "C4", axis: "contemporary" },
      ],
      guesses: [
        { text: "W1", correct: false, timestamp: "2026-01-01" },
        { text: "W2", correct: false, timestamp: "2026-01-01" },
      ],
      mode: "normal",
      totalClues: 6,
      submitGuess: vi.fn(),
      error: null,
      roster: [],
    });

    render(<GamePlay />);
    expect(screen.getByText("No more clues")).toBeInTheDocument();
    expect(screen.getByText("You have what you need. Now decide.")).toBeInTheDocument();
  });

  it("shows hard-specific exhausted message", () => {
    (useGameStore as any).mockReturnValue({
      clues: [
        { number: 1, text: "C1", axis: "origin" },
        { number: 2, text: "C2", axis: "work" },
      ],
      guesses: [{ text: "W1", correct: false, timestamp: "2026-01-01" }],
      mode: "hard",
      totalClues: 6,
      submitGuess: vi.fn(),
      error: null,
      roster: [],
    });

    render(<GamePlay />);
    expect(screen.getByText("The silence is the point. Trust your gut.")).toBeInTheDocument();
  });

  it("does not show exhausted message when clues remain", () => {
    (useGameStore as any).mockReturnValue({
      clues: [{ number: 1, text: "C1", axis: "origin" }],
      guesses: [],
      mode: "normal",
      totalClues: 6,
      submitGuess: vi.fn(),
      error: null,
      roster: [],
    });

    render(<GamePlay />);
    expect(screen.queryByText("No more clues")).not.toBeInTheDocument();
  });

  it("submits guess on button click", async () => {
    const submitGuess = vi.fn();
    (useGameStore as any).mockReturnValue({
      clues: [{ number: 1, text: "C1", axis: "origin" }],
      guesses: [],
      mode: "easy",
      totalClues: 6,
      submitGuess,
      error: null,
      roster: [],
    });

    render(<GamePlay />);
    const input = screen.getByPlaceholderText("Type your guess...");
    await userEvent.type(input, "Chinua Achebe");
    await userEvent.click(screen.getByText("FILE IT"));
    expect(submitGuess).toHaveBeenCalledWith("Chinua Achebe");
  });

  it("displays error messages", () => {
    (useGameStore as any).mockReturnValue({
      clues: [],
      guesses: [],
      mode: "easy",
      totalClues: 6,
      submitGuess: vi.fn(),
      error: "Game not started",
      roster: [],
    });

    render(<GamePlay />);
    expect(screen.getByText("Game not started")).toBeInTheDocument();
  });
});
