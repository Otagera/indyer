import { describe, it, expect } from "vitest";
import { mulberry32, hashSeed } from "./prng.ts";

describe("mulberry32", () => {
  it("produces deterministic output for the same seed", () => {
    const gen1 = mulberry32(12345);
    const gen2 = mulberry32(12345);
    const a = Array.from({ length: 10 }, () => gen1());
    const b = Array.from({ length: 10 }, () => gen2());
    expect(a).toEqual(b);
  });

  it("produces different output for different seeds", () => {
    const gen1 = mulberry32(12345);
    const gen2 = mulberry32(99999);
    const a = Array.from({ length: 5 }, () => gen1());
    const b = Array.from({ length: 5 }, () => gen2());
    expect(a).not.toEqual(b);
  });

  it("returns values between 0 and 1", () => {
    const gen = mulberry32(42);
    for (let i = 0; i < 1000; i++) {
      const v = gen();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("matches known output for seed 42", () => {
    const gen = mulberry32(42);
    const first5 = Array.from({ length: 5 }, () => gen());
    expect(first5).toMatchSnapshot();
  });
});

describe("hashSeed", () => {
  it("returns the same hash for the same inputs", () => {
    expect(hashSeed(42, "hello")).toBe(hashSeed(42, "hello"));
  });

  it("returns different hashes for different labels", () => {
    expect(hashSeed(42, "hello")).not.toBe(hashSeed(42, "world"));
  });

  it("returns different hashes for different base seeds", () => {
    expect(hashSeed(1, "hello")).not.toBe(hashSeed(2, "hello"));
  });

  it("returns a non-negative 32-bit integer", () => {
    const h = hashSeed(42, "2026-07-11");
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThan(4294967296);
  });
});
