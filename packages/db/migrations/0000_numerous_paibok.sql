CREATE TABLE IF NOT EXISTS "clues" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_id" integer NOT NULL,
	"axis" varchar(20) NOT NULL,
	"text" text NOT NULL,
	"source" jsonb,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_states" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" varchar(255) NOT NULL,
	"issue_no" integer NOT NULL,
	"mode" varchar(10),
	"guesses" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"solved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "puzzles" (
	"id" serial PRIMARY KEY NOT NULL,
	"issue_no" integer NOT NULL,
	"subject_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "puzzles_issue_no_unique" UNIQUE("issue_no")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"accepted_answers" text[] DEFAULT '{}' NOT NULL,
	"category" varchar(20) NOT NULL,
	"era" varchar(50) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clues" ADD CONSTRAINT "clues_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "puzzles" ADD CONSTRAINT "puzzles_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_clues_subject_axis" ON "clues" USING btree ("subject_id","axis");