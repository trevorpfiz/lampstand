CREATE TABLE "lamp_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" uuid NOT NULL,
	"role" varchar(256) NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "lamp_feedback" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lamp_feedback" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "lamp_feedback" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lamp_study" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lamp_study" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "lamp_study" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lamp_chat" ADD COLUMN "title" varchar(256) DEFAULT 'New Chat' NOT NULL;--> statement-breakpoint
ALTER TABLE "lamp_chat" ADD COLUMN "visibility" varchar DEFAULT 'private' NOT NULL;--> statement-breakpoint
ALTER TABLE "lamp_message" ADD CONSTRAINT "lamp_message_chat_id_lamp_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."lamp_chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "message_chat_id_idx" ON "lamp_message" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "message_created_at_idx" ON "lamp_message" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "lamp_chat" DROP COLUMN "messages";