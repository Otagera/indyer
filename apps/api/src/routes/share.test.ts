import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { share } from "./share.js";

vi.mock("../db/client.js", () => ({
  getClient: vi.fn(),
}));

vi.mock("@indyer/db/puzzle-selector", () => ({
  getSubjectForDate: vi.fn(() => 1),
  getIssueNo: vi.fn(() => 42),
}));

vi.mock("../lib/share-card.js", () => ({
  generateShareCardSvg: vi.fn(() => '<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
}));

vi.mock("../lib/fonts.js", () => ({
  getFonts: vi.fn(async () => ({
    playfair: Buffer.from("fake-font"),
    dmSans: Buffer.from("fake-font"),
    dmSansBold: Buffer.from("fake-font"),
  })),
}));

import { getClient } from "../db/client.js";

vi.mock("@resvg/resvg-js", () => ({
  Resvg: class {
    constructor(_svg: any, _opts: any) {}
    render() {
      return { asPng: () => Buffer.from("fake-png-bytes") };
    }
  },
}));

type TableData = Record<string, any[]>;

const TABLE_NAME_SYM = Symbol.for("drizzle:Name");

function tableName(table: any): string {
  if (!table) return "";
  return table[TABLE_NAME_SYM] ?? "";
}

function mockDb(data: TableData) {
  function makeChain(rows: any[]) {
    const then = (resolve: (v: any) => void) => resolve(rows);
    const chain: any = {
      then,
      limit: (n: number) => makeChain(rows.slice(0, n)),
      offset: () => makeChain(rows),
      orderBy: () => makeChain(rows),
      where: () => makeChain(rows),
    };
    return chain;
  }

  const db = {
    select: vi.fn(() => ({
      from: vi.fn((table: any) => {
        const name = tableName(table);
        return makeChain(data[name] ?? []);
      }),
    })),
    insert: vi.fn(() => ({ values: vi.fn(() => Promise.resolve()) })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })) })),
  };
  return db;
}

const identityMiddleware = async (c: any, next: any) => {
  c.set("playerId", "test-player-123");
  await next();
};

function createApp(tables: TableData) {
  const db = mockDb(tables);
  (getClient as any).mockReturnValue(db);
  const app = new Hono();
  app.use("*", identityMiddleware);
  app.route("/share", share);
  return app;
}

describe("GET /share/card", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when no game state exists", async () => {
    const app = createApp({
      subjects: [{ id: 1, name: "Test", active: true }],
      game_states: [],
      puzzles: [{ id: 1, issueNo: 42, subjectId: 1 }],
      clues: [{ text: "Some clue", order: 1 }],
    });
    const res = await app.request("/share/card");
    expect(res.status).toBe(400);
  });

  it("returns PNG image when game state exists", async () => {
    const app = createApp({
      subjects: [{ id: 1, name: "Test Subject", active: true }],
      game_states: [
        {
          id: 1,
          playerId: "test-player-123",
          issueNo: 42,
          mode: "easy",
          guesses: [{ text: "guess", correct: false, timestamp: new Date().toISOString() }],
          cluesRevealed: 1,
          solved: false,
        },
      ],
      puzzles: [{ id: 1, issueNo: 42, subjectId: 1 }],
      clues: [{ text: "First clue text", order: 1 }],
    });
    const res = await app.request("/share/card");
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/png");
  });
});
