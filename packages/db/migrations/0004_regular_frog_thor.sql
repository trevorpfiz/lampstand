ALTER TABLE "lamp_note" ALTER COLUMN "title" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "lamp_note" ALTER COLUMN "content" SET DEFAULT '[]'::jsonb;