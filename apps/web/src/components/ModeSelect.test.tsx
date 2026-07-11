import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModeSelect } from "./ModeSelect";
import { useGameStore } from "../stores/game";

vi.mock("../stores/game", () => ({
  useGameStore: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ModeSelect", () => {
  it("renders three mode cards", () => {
    (useGameStore as any).mockReturnValue({
      startGame: vi.fn(),
      error: null,
    });

    render(<ModeSelect />);

    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Normal")).toBeInTheDocument();
    expect(screen.getByText("Hard")).toBeInTheDocument();
  });

  it("shows clue counts for each mode", () => {
    (useGameStore as any).mockReturnValue({
      startGame: vi.fn(),
      error: null,
    });

    render(<ModeSelect />);

    expect(screen.getByText("6 clues")).toBeInTheDocument();
    expect(screen.getByText("4 clues")).toBeInTheDocument();
    expect(screen.getByText("2 clues")).toBeInTheDocument();
  });

  it("calls startGame when a mode card is clicked", async () => {
    const startGame = vi.fn();
    (useGameStore as any).mockReturnValue({
      startGame,
      error: null,
    });

    render(<ModeSelect />);
    await userEvent.click(screen.getByText("Hard"));
    expect(startGame).toHaveBeenCalledWith("hard");
  });

  it("displays error message when present", () => {
    (useGameStore as any).mockReturnValue({
      startGame: vi.fn(),
      error: "Something went wrong",
    });

    render(<ModeSelect />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
