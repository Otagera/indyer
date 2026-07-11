import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import { game } from "./game.js";

vi.mock("../db/client.js", () => ({
  getClient: vi.fn(),
}));

vi.mock("@indyer/db/puzzle-selector", () => ({
  getSubjectForDate: vi.fn(() => 1),
  getIssueNo: vi.fn(() => 1),
}));

import { getClient } from "../db/client.js";

const defaultClues = [
  { number: 1, text: "Clue one", axis: "origin" },
  { number: 2, text: "Clue two", axis: "work" },
  { number: 3, text: "Clue three", axis: "place" },
  { number: 4, text: "Clue four", axis: "contemporary" },
  { number: 5, text: "Clue five", axis: "epithet" },
  { number: 6, text: "Clue six", axis: "end" },
];

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
      offset: (n: number) => makeChain(rows.slice(n)),
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
    insert: vi.fn(() => ({
      values: vi.fn(() => Promise.resolve()),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve()),
      })),
    })),
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
  app.route("/game", game);
  return app;
}

describe("GET /game/today", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns new status with available modes when no game state exists", async () => {
    const app = createApp({
      subjects: [{ id: 1, name: "Test Subject", active: true, category: "writer" }],
      game_states: [],
      puzzles: [],
    });
    const res = await app.request("/game/today");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("new");
    expect(body.availableModes).toEqual(["easy", "normal", "hard"]);
    expect(body.issueNo).toBe(1);
    expect(body.subjectName).toBeUndefined();
  });

  it("returns started status with mode and clues when game is in progress", async () => {
    const app = createApp({
      subjects: [{ id: 1, name: "Test Subject", active: true, category: "writer" }],
      game_states: [
        {
          id: 1,
          playerId: "test-player-123",
          issueNo: 1,
          mode: "normal",
          guesses: [{ text: "wrong guess", correct: false, timestamp: new Date().toISOString() }],
          cluesRevealed: 2,
          solved: false,
        },
      ],
      puzzles: [{ id: 1, issueNo: 1, subjectId: 1, date: new Date() }],
      clues: defaultClues,
    });
    const res = await app.request("/game/today");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("started");
    expect(body.mode).toBe("normal");
    expect(body.clues).toHaveLength(2);
    expect(body.guesses).toHaveLength(1);
    expect(body.guesses[0].correct).toBe(false);
  });

  it("returns solved status with subject name and all clues", async () => {
    const app = createApp({
      subjects: [{ id: 1, name: "Test Subject", active: true, category: "writer" }],
      game_states: [
        {
          id: 1,
          playerId: "test-player-123",
          issueNo: 1,
          mode: "easy",
          guesses: [{ text: "test subject", correct: true, timestamp: new Date().toISOString() }],
          cluesRevealed: 1,
          solved: true,
        },
      ],
      puzzles: [{ id: 1, issueNo: 1, subjectId: 1, date: new Date() }],
      clues: defaultClues,
    });
    const res = await app.request("/game/today");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("solved");
    expect(body.subjectName).toBe("Test Subject");
    expect(body.category).toBe("writer");
    expect(body.allClues).toHaveLength(6);
  });

  it("returns failed status when 6 guesses used and not solved", async () => {
    const guesses = Array.from({ length: 6 }, (_, i) => ({
      text: `guess ${i}`,
      correct: false,
      timestamp: new Date().toISOString(),
    }));
    const app = createApp({
      subjects: [{ id: 1, name: "Test Subject", active: true, category: "leader" }],
      game_states: [
        {
          id: 1,
          playerId: "test-player-123",
          issueNo: 1,
          mode: "hard",
          guesses,
          cluesRevealed: 2,
          solved: false,
        },
      ],
      puzzles: [{ id: 1, issueNo: 1, subjectId: 1, date: new Date() }],
      clues: defaultClues,
    });
    const res = await app.request("/game/today");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("failed");
    expect(body.subjectName).toBe("Test Subject");
  });
});

describe("POST /game/start", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates game state and returns first clue", async () => {
    const app = createApp({
      subjects: [{ id: 1, name: "Test Subject", active: true, category: "writer" }],
      game_states: [],
      puzzles: [],
      clues: defaultClues,
    });
    const res = await app.request("/game/start", {
      method: "POST",
      body: JSON.stringify({ mode: "normal" }),
      headers: { "Content-Type": "application/json" },
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.mode).toBe("normal");
    expect(body.clue.number).toBe(1);
    expect(body.cluesShown).toBe(1);
    expect(body.guessesLeft).toBe(6);
  });

  it("rejects invalid mode", async () => {
    const app = createApp({
      subjects: [],
      game_states: [],
      puzzles: [],
      clues: [],
    });
    const res = await app.request("/game/start", {
      method: "POST",
      body: JSON.stringify({ mode: "impossible" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(400);
  });

  it("rejects if already started today", async () => {
    const app = createApp({
      subjects: [{ id: 1, name: "Test Subject", active: true, category: "writer" }],
      game_states: [
        { id: 1, playerId: "test-player-123", issueNo: 1, mode: "easy" },
      ],
      puzzles: [],
      clues: defaultClues,
    });
    const res = await app.request("/game/start", {
      method: "POST",
      body: JSON.stringify({ mode: "easy" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(409);
  });
});

describe("POST /game/guess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("correct guess ends the game and reveals answer", async () => {
    const app = createApp({
      subjects: [
        { id: 1, name: "Test Subject", acceptedAnswers: ["Test Subject", "test"], active: true, category: "writer" },
      ],
      game_states: [
        {
          id: 1,
          playerId: "test-player-123",
          issueNo: 1,
          mode: "normal",
          guesses: [],
          cluesRevealed: 1,
          solved: false,
        },
      ],
      puzzles: [{ id: 1, issueNo: 1, subjectId: 1, date: new Date() }],
      clues: defaultClues,
    });
    const res = await app.request("/game/guess", {
      method: "POST",
      body: JSON.stringify({ text: "Test Subject" }),
      headers: { "Content-Type": "application/json" },
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.correct).toBe(true);
    expect(body.gameOver).toBe(true);
    expect(body.answer).toBe("Test Subject");
    expect(body.nextClue).toBeNull();
    expect(body.category).toBeDefined();
    expect(body.allClues).toBeDefined();
  });

  it("wrong guess returns next clue within budget", async () => {
    const app = createApp({
      subjects: [
        { id: 1, name: "Test Subject", acceptedAnswers: ["Test Subject"], active: true, category: "musician" },
      ],
      game_states: [
        {
          id: 1,
          playerId: "test-player-123",
          issueNo: 1,
          mode: "normal",
          guesses: [],
          cluesRevealed: 1,
          solved: false,
        },
      ],
      puzzles: [{ id: 1, issueNo: 1, subjectId: 1, date: new Date() }],
      clues: defaultClues,
    });
    const res = await app.request("/game/guess", {
      method: "POST",
      body: JSON.stringify({ text: "Wrong Guess" }),
      headers: { "Content-Type": "application/json" },
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.correct).toBe(false);
    expect(body.gameOver).toBe(false);
    expect(body.nextClue).not.toBeNull();
    expect(body.guessesLeft).toBe(5);
    expect(body.answer).toBeUndefined();
  });

  it("wrong final guess ends the game and reveals answer", async () => {
    const guesses = Array.from({ length: 5 }, (_, i) => ({
      text: `guess ${i}`,
      correct: false,
      timestamp: new Date().toISOString(),
    }));
    const app = createApp({
      subjects: [
        { id: 1, name: "Test Subject", acceptedAnswers: ["Test Subject"], active: true, category: "writer" },
      ],
      game_states: [
        {
          id: 1,
          playerId: "test-player-123",
          issueNo: 1,
          mode: "normal",
          guesses,
          cluesRevealed: 4,
          solved: false,
        },
      ],
      puzzles: [{ id: 1, issueNo: 1, subjectId: 1, date: new Date() }],
      clues: defaultClues,
    });
    const res = await app.request("/game/guess", {
      method: "POST",
      body: JSON.stringify({ text: "Still Wrong" }),
      headers: { "Content-Type": "application/json" },
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.correct).toBe(false);
    expect(body.gameOver).toBe(true);
    expect(body.answer).toBe("Test Subject");
    expect(body.nextClue).toBeNull();
  });

  it("rejects guess when game not started", async () => {
    const app = createApp({
      subjects: [{ id: 1, name: "Test Subject", acceptedAnswers: ["Test Subject"], active: true, category: "writer" }],
      game_states: [],
      puzzles: [{ id: 1, issueNo: 1, subjectId: 1, date: new Date() }],
      clues: defaultClues,
    });
    const res = await app.request("/game/guess", {
      method: "POST",
      body: JSON.stringify({ text: "Test Subject" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("NOT_STARTED");
  });

  it("rejects guess when already solved", async () => {
    const app = createApp({
      subjects: [{ id: 1, name: "Test Subject", acceptedAnswers: ["Test Subject"], active: true, category: "writer" }],
      game_states: [
        {
          id: 1,
          playerId: "test-player-123",
          issueNo: 1,
          mode: "easy",
          guesses: [{ text: "test", correct: true, timestamp: new Date().toISOString() }],
          cluesRevealed: 1,
          solved: true,
        },
      ],
      puzzles: [{ id: 1, issueNo: 1, subjectId: 1, date: new Date() }],
      clues: defaultClues,
    });
    const res = await app.request("/game/guess", {
      method: "POST",
      body: JSON.stringify({ text: "anything" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("ALREADY_SOLVED");
  });

  it("rejects guess when no guesses remaining", async () => {
    const guesses = Array.from({ length: 6 }, (_, i) => ({
      text: `guess ${i}`,
      correct: false,
      timestamp: new Date().toISOString(),
    }));
    const app = createApp({
      subjects: [{ id: 1, name: "Test Subject", acceptedAnswers: ["Test Subject"], active: true, category: "writer" }],
      game_states: [
        {
          id: 1,
          playerId: "test-player-123",
          issueNo: 1,
          mode: "easy",
          guesses,
          cluesRevealed: 6,
          solved: false,
        },
      ],
      puzzles: [{ id: 1, issueNo: 1, subjectId: 1, date: new Date() }],
      clues: defaultClues,
    });
    const res = await app.request("/game/guess", {
      method: "POST",
      body: JSON.stringify({ text: "anything" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("NO_GUESSES_LEFT");
  });

  it("rejects empty guess", async () => {
    const app = createApp({
      subjects: [{ id: 1, name: "Test Subject", acceptedAnswers: ["Test Subject"], active: true, category: "writer" }],
      game_states: [
        {
          id: 1,
          playerId: "test-player-123",
          issueNo: 1,
          mode: "easy",
          guesses: [],
          cluesRevealed: 1,
          solved: false,
        },
      ],
      puzzles: [{ id: 1, issueNo: 1, subjectId: 1, date: new Date() }],
      clues: defaultClues,
    });
    const res = await app.request("/game/guess", {
      method: "POST",
      body: JSON.stringify({ text: "" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(400);
  });

  it("fuzzy matches with case-insensitive input", async () => {
    const app = createApp({
      subjects: [
        { id: 1, name: "Chinua Achebe", acceptedAnswers: ["Chinua Achebe", "achebe"], active: true, category: "writer" },
      ],
      game_states: [
        {
          id: 1,
          playerId: "test-player-123",
          issueNo: 1,
          mode: "easy",
          guesses: [],
          cluesRevealed: 1,
          solved: false,
        },
      ],
      puzzles: [{ id: 1, issueNo: 1, subjectId: 1, date: new Date() }],
      clues: defaultClues,
    });
    const res = await app.request("/game/guess", {
      method: "POST",
      body: JSON.stringify({ text: "chinua achebe" }),
      headers: { "Content-Type": "application/json" },
    });
    const body = await res.json();
    expect(body.correct).toBe(true);
  });
});
