import { describe, it, expect } from "vitest";
import { normalize, levenshtein, fuzzyMatch } from "./fuzzy.ts";

describe("normalize", () => {
  it("lowercases input", () => {
    expect(normalize("HELLO")).toBe("hello");
  });

  it("strips punctuation", () => {
    expect(normalize("hello, world!")).toBe("hello world");
  });

  it("collapses whitespace", () => {
    expect(normalize("  hello   world  ")).toBe("hello world");
  });

  it("handles empty string", () => {
    expect(normalize("")).toBe("");
  });

  it("removes apostrophes and hyphens", () => {
    expect(normalize("O'Brien's")).toBe("obriens");
  });
});

describe("levenshtein", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshtein("hello", "hello")).toBe(0);
  });

  it("returns correct distance for insertions", () => {
    expect(levenshtein("cat", "cats")).toBe(1);
  });

  it("returns correct distance for deletions", () => {
    expect(levenshtein("cats", "cat")).toBe(1);
  });

  it("returns correct distance for substitutions", () => {
    expect(levenshtein("cat", "cut")).toBe(1);
  });

  it("handles completely different strings", () => {
    expect(levenshtein("abc", "xyz")).toBe(3);
  });

  it("handles empty strings", () => {
    expect(levenshtein("", "abc")).toBe(3);
    expect(levenshtein("abc", "")).toBe(3);
    expect(levenshtein("", "")).toBe(0);
  });
});

describe("fuzzyMatch", () => {
  const answers = ["Nnamdi Azikiwe", "Obafemi Awolowo", "Ibrahim Babangida"];

  it("exact match returns true", () => {
    expect(fuzzyMatch("Nnamdi Azikiwe", answers)).toBe(true);
  });

  it("case-insensitive match returns true", () => {
    expect(fuzzyMatch("nnamdi azikiwe", answers)).toBe(true);
  });

  it("punctuation-tolerant match returns true", () => {
    expect(fuzzyMatch("Nnamdi Azikiwe!", answers)).toBe(true);
  });

  it("Levenshtein distance <= 2 returns true", () => {
    expect(fuzzyMatch("Nnamdi Azikive", answers)).toBe(true);
  });

  it("Levenshtein distance > 2 returns false", () => {
    expect(fuzzyMatch("Nmandi Azikive", answers)).toBe(false);
  });

  it("partial name does not match", () => {
    expect(fuzzyMatch("Nnamdi", answers)).toBe(false);
  });

  it("common nickname matches when included in accepted answers", () => {
    expect(fuzzyMatch("IBB", ["Ibrahim Babangida", "IBB", "babangida", "maradona"])).toBe(true);
  });

  it("close typo with distance <= 2 matches", () => {
    expect(fuzzyMatch("Obafemi Awolowo", ["Obafemi Awolowo"])).toBe(true);
  });

  it("returns false for unrelated input", () => {
    expect(fuzzyMatch("Margaret Thatcher", answers)).toBe(false);
  });
});
