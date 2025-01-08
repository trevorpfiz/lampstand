ALTER TABLE "lamp_note" DROP CONSTRAINT "lamp_note_study_id_lamp_study_id_fk";
--> statement-breakpoint
ALTER TABLE "lamp_note" ADD CONSTRAINT "lamp_note_study_id_lamp_study_id_fk" FOREIGN KEY ("study_id") REFERENCES "public"."lamp_study"("id") ON DELETE no action ON UPDATE no action;