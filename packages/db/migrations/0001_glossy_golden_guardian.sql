CREATE TABLE "lamp_chat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"study_id" uuid NOT NULL,
	"messages" jsonb[] DEFAULT '{}'::jsonb[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "lamp_study" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lamp_note" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"study_id" uuid NOT NULL,
	"title" varchar(256) NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DROP INDEX "name_idx";--> statement-breakpoint
DROP INDEX "email_idx";--> statement-breakpoint
ALTER TABLE "lamp_chat" ADD CONSTRAINT "lamp_chat_profile_id_lamp_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."lamp_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lamp_chat" ADD CONSTRAINT "lamp_chat_study_id_lamp_study_id_fk" FOREIGN KEY ("study_id") REFERENCES "public"."lamp_study"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lamp_study" ADD CONSTRAINT "lamp_study_profile_id_lamp_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."lamp_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lamp_note" ADD CONSTRAINT "lamp_note_profile_id_lamp_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."lamp_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lamp_note" ADD CONSTRAINT "lamp_note_study_id_lamp_study_id_fk" FOREIGN KEY ("study_id") REFERENCES "public"."lamp_study"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_profile_id_idx" ON "lamp_chat" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "chat_study_id_idx" ON "lamp_chat" USING btree ("study_id");--> statement-breakpoint
CREATE INDEX "chat_created_at_idx" ON "lamp_chat" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "study_profile_id_idx" ON "lamp_study" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "study_created_at_idx" ON "lamp_study" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "note_profile_id_idx" ON "lamp_note" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "note_study_id_idx" ON "lamp_note" USING btree ("study_id");--> statement-breakpoint
CREATE INDEX "note_created_at_idx" ON "lamp_note" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "profile_name_idx" ON "lamp_profile" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_email_idx" ON "lamp_profile" USING btree ("email");