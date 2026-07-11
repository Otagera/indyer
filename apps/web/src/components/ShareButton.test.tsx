import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShareButton } from "./ShareButton";

describe("ShareButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders share button", () => {
    render(<ShareButton />);
    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("disables while loading", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn(() => new Promise(() => {})) as any;

    render(<ShareButton />);
    await user.click(screen.getByText("Share"));
    expect(screen.getByText("Generating…")).toBeInTheDocument();
  });

  it("falls back to clipboard writeText on unsupported browsers", async () => {
    const user = userEvent.setup();
    const blob = new Blob(["fake-png"], { type: "image/png" });
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, blob: () => Promise.resolve(blob) })) as any;
    Object.defineProperty(globalThis.navigator, "share", { value: undefined, configurable: true });
    Object.defineProperty(globalThis.navigator, "clipboard", {
      value: { write: undefined, writeText: vi.fn(() => Promise.resolve()) },
      configurable: true,
    });

    render(<ShareButton />);
    await user.click(screen.getByText("Share"));

    await screen.findByText("Copied!");
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Play Indyer at indyer.otagera.xyz");
  });
});
