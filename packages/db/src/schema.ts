import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  aliases: text("aliases").array(),
  category: varchar("category", { length: 100 }).notNull(),
  bioLine: text("bio_line"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const puzzles = pgTable("puzzles", {
  id: serial("id").primaryKey(),
  issueNo: integer("issue_no").notNull().unique(),
  subjectId: integer("subject_id")
    .references(() => subjects.id)
    .notNull(),
  clues: text("clues").array().notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameStates = pgTable("game_states", {
  id: serial("id").primaryKey(),
  playerId: varchar("player_id", { length: 255 }).notNull(),
  issueNo: integer("issue_no").notNull(),
  mode: varchar("mode", { length: 10 }),
  guesses: jsonb("guesses").default([]).notNull(),
  solved: boolean("solved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
