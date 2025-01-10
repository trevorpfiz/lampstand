ALTER TABLE "lamp_note" DROP CONSTRAINT "lamp_note_study_id_lamp_study_id_fk";
--> statement-breakpoint
ALTER TABLE "lamp_note" ALTER COLUMN "study_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lamp_note" ADD CONSTRAINT "lamp_note_study_id_lamp_study_id_fk" FOREIGN KEY ("study_id") REFERENCES "public"."lamp_study"("id") ON DELETE set null ON UPDATE no action;