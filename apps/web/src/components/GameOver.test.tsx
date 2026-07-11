import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GameOver } from "./GameOver";

vi.mock("../stores/game", () => ({
  useGameStore: vi.fn(),
}));

import { useGameStore } from "../stores/game";

describe("GameOver", () => {
  it("shows solved state with answer and correct guess", () => {
    (useGameStore as any).mockReturnValue({
      screen: "solved",
      clues: [{ number: 1, text: "Born in Jos", axis: "place" }],
      allClues: [{ number: 1, text: "Born in Jos", axis: "place" }],
      guesses: [{ text: "Test Subject", correct: true, timestamp: "2026-01-01" }],
      mode: "easy",
      issueNo: 10,
      answer: "Test Subject",
      category: "writer",
    });

    render(<GameOver />);

    expect(screen.getByText("SOLVED")).toBeInTheDocument();
    expect(screen.getByText("Identity Confirmed")).toBeInTheDocument();
    expect(screen.getByText("Writer")).toBeInTheDocument();
    expect(screen.getByText("Born in Jos")).toBeInTheDocument();
    expect(screen.getByText("The New Herald · Issue 10")).toBeInTheDocument();
  });

  it("shows failed state with answer", () => {
    const guesses = Array.from({ length: 6 }, (_, i) => ({
      text: `guess ${i}`,
      correct: false,
      timestamp: "2026-01-01",
    }));

    (useGameStore as any).mockReturnValue({
      screen: "failed",
      clues: [{ number: 1, text: "Born in Jos", axis: "place" }],
      allClues: [{ number: 1, text: "Born in Jos", axis: "place" }],
      guesses,
      mode: "hard",
      issueNo: 5,
      answer: "Test Subject",
      category: "musician",
    });

    render(<GameOver />);

    expect(screen.getByText("FAILED")).toBeInTheDocument();
    expect(screen.getByText("Case Unsolved")).toBeInTheDocument();
    expect(screen.getByText("Musician")).toBeInTheDocument();
  });

  it("shows unseen clue divider when there are hidden clues", () => {
    (useGameStore as any).mockReturnValue({
      screen: "failed",
      clues: [{ number: 1, text: "Visible clue", axis: "origin" }],
      allClues: [
        { number: 1, text: "Visible clue", axis: "origin" },
        { number: 2, text: "Hidden clue", axis: "work" },
      ],
      guesses: Array.from({ length: 6 }, (_, i) => ({
        text: `guess ${i}`,
        correct: false,
        timestamp: "2026-01-01",
      })),
      mode: "hard",
      issueNo: 1,
      answer: "Test Subject",
      category: "leader",
    });

    render(<GameOver />);

    expect(screen.getByText((content) => content.includes("Clues you didn"))).toBeInTheDocument();
    expect(screen.getByText("Hidden clue")).toBeInTheDocument();
  });

  it("shows game stats", () => {
    (useGameStore as any).mockReturnValue({
      screen: "solved",
      clues: [],
      allClues: [],
      guesses: Array.from({ length: 3 }, () => ({
        text: "guess",
        correct: false,
        timestamp: "2026-01-01",
      })),
      mode: "normal",
      issueNo: 1,
      answer: "Test Subject",
      category: "writer",
    });

    render(<GameOver />);
    expect(screen.getByText((content) => content.includes("3/6 guesses"))).toBeInTheDocument();
  });
});
