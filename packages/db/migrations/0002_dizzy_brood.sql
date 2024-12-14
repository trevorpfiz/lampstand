CREATE TABLE "lamp_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lamp_feedback" ADD CONSTRAINT "lamp_feedback_profile_id_lamp_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."lamp_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feedback_profile_id_idx" ON "lamp_feedback" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "feedback_created_at_idx" ON "lamp_feedback" USING btree ("created_at");