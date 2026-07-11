import { describe, it, expect } from "vitest";
import { getSubjectForDate, getIssueNo } from "./puzzle-selector.ts";

describe("getIssueNo", () => {
  it("returns 1 for launch date", () => {
    const launch = new Date("2026-07-11");
    expect(getIssueNo(launch)).toBe(1);
  });

  it("returns 2 for the day after launch", () => {
    const next = new Date("2026-07-12");
    expect(getIssueNo(next)).toBe(2);
  });

  it("increments correctly over a month", () => {
    const later = new Date("2026-08-11");
    expect(getIssueNo(later)).toBe(32);
  });

  it("returns positive numbers for future dates", () => {
    const future = new Date("2027-01-01");
    expect(getIssueNo(future)).toBeGreaterThan(0);
  });
});

describe("getSubjectForDate", () => {
  const subjects = [
    { id: 1, active: true },
    { id: 2, active: true },
    { id: 3, active: true },
    { id: 4, active: true },
    { id: 5, active: true },
  ];

  it("returns null when no active subjects", () => {
    expect(getSubjectForDate([], new Date())).toBeNull();
  });

  it("returns a valid subject id from the active list", () => {
    const result = getSubjectForDate(subjects, new Date("2026-07-11"));
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(5);
  });

  it("returns the same subject for the same date", () => {
    const a = getSubjectForDate(subjects, new Date("2026-07-11"));
    const b = getSubjectForDate(subjects, new Date("2026-07-11"));
    expect(a).toBe(b);
  });

  it("returns different subjects for different dates", () => {
    const a = getSubjectForDate(subjects, new Date("2026-07-11"));
    const b = getSubjectForDate(subjects, new Date("2026-07-12"));
    expect(a).not.toBe(b);
  });

  it("cycles through all subjects over time", () => {
    const chosen = new Set<number>();
    for (let d = 0; d < 30; d++) {
      const date = new Date("2026-07-11");
      date.setDate(date.getDate() + d);
      const id = getSubjectForDate(subjects, date);
      chosen.add(id!);
    }
    expect(chosen.size).toBe(subjects.length);
  });

  it("filters out inactive subjects", () => {
    const mixed = [
      { id: 1, active: true },
      { id: 2, active: false },
      { id: 3, active: true },
    ];
    for (let d = 0; d < 20; d++) {
      const date = new Date("2026-07-11");
      date.setDate(date.getDate() + d);
      const id = getSubjectForDate(mixed, date);
      expect(id).not.toBe(2);
    }
  });
});
