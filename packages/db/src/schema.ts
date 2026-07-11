import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  acceptedAnswers: text("accepted_answers").array().notNull().default([]),
  category: varchar("category", { length: 20 }).notNull(),
  era: varchar("era", { length: 50 }).notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clues = pgTable("clues", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id")
    .references(() => subjects.id)
    .notNull(),
  axis: varchar("axis", { length: 20 }).notNull(),
  text: text("text").notNull(),
  source: jsonb("source"),
  order: integer("order").notNull(),
}, (t) => ({
  uniqueSubjectAxis: uniqueIndex("uq_clues_subject_axis").on(t.subjectId, t.axis),
}));

export const puzzles = pgTable("puzzles", {
  id: serial("id").primaryKey(),
  issueNo: integer("issue_no").notNull().unique(),
  subjectId: integer("subject_id")
    .references(() => subjects.id)
    .notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameStates = pgTable("game_states", {
  id: serial("id").primaryKey(),
  playerId: varchar("player_id", { length: 36 }).notNull(),
  issueNo: integer("issue_no").notNull(),
  mode: varchar("mode", { length: 10 }),
  guesses: jsonb("guesses").default([]).notNull(),
  solved: boolean("solved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const playerIdentities = pgTable("player_identities", {
  playerId: varchar("player_id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const authCodes = pgTable("auth_codes", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  code: varchar("code", { length: 10 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
