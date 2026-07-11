CREATE TABLE IF NOT EXISTS "auth_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"code" varchar(10) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_identities" (
	"player_id" varchar(36) PRIMARY KEY NOT NULL,
	"email" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "player_identities_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "game_states" ALTER COLUMN "player_id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "game_states" ADD COLUMN "clues_revealed" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_game_states_player_issue" ON "game_states" USING btree ("player_id","issue_no");