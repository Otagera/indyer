import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ClueBox } from "./ClueBox";

describe("ClueBox", () => {
  it("renders clues without source", () => {
    render(<ClueBox clues={[{ number: 1, text: "Born in Jos", axis: "origin" }]} />);
    expect(screen.getByText("Born in Jos")).toBeInTheDocument();
    expect(screen.getByText(/Origin/)).toBeInTheDocument();
  });

  it("renders source credit when source is present", () => {
    render(
      <ClueBox
        clues={[
          {
            number: 2,
            text: "Known for writing",
            axis: "work",
            source: { publication: "The Guardian", date: "Jan 1, 2020", page: "3", permalink: "https://example.com" },
          },
        ]}
      />,
    );
    expect(screen.getByText("Known for writing")).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes("The Guardian"))).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes("p.3"))).toBeInTheDocument();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("skips source credit when source is null", () => {
    render(<ClueBox clues={[{ number: 3, text: "Some clue", axis: "place", source: null }]} />);
    expect(screen.getByText("Some clue")).toBeInTheDocument();
    expect(screen.queryByText(/Source/)).not.toBeInTheDocument();
  });
});
