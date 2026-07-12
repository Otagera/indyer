import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FrontPage } from "./FrontPage";

vi.mock("../stores/game", () => ({
  useGameStore: vi.fn(),
}));

import { useGameStore } from "../stores/game";

describe("FrontPage", () => {
  it("shows solved summary and returns to results on click", () => {
    const viewResults = vi.fn();
    (useGameStore as any).mockReturnValue({
      screen: "home",
      issueNo: 7,
      mode: "hard",
      guesses: [{ text: "Test Subject", correct: true, timestamp: "2026-01-01" }],
      viewResults,
    });

    render(<FrontPage />);

    expect(screen.getByText("Issue 7")).toBeInTheDocument();
    expect(screen.getByText("Identity Confirmed")).toBeInTheDocument();
    expect(screen.getByText(/hard mode · 1\/6 guesses/)).toBeInTheDocument();
    expect(screen.getByText(/new issue hits the stands tomorrow/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /read today/i }));
    expect(viewResults).toHaveBeenCalled();
  });

  it("shows unsolved summary when no guess was correct", () => {
    (useGameStore as any).mockReturnValue({
      screen: "home",
      issueNo: 3,
      mode: "easy",
      guesses: Array.from({ length: 6 }, (_, i) => ({
        text: `guess ${i}`,
        correct: false,
        timestamp: "2026-01-01",
      })),
      viewResults: vi.fn(),
    });

    render(<FrontPage />);

    expect(screen.getByText("Case Unsolved")).toBeInTheDocument();
    expect(screen.getByText(/easy mode · 6\/6 guesses/)).toBeInTheDocument();
  });
});
