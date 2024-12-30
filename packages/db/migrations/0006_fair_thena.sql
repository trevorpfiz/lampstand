ALTER TABLE "lamp_profile" ADD COLUMN "llm_usage" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "lamp_profile" ADD COLUMN "premium_llm_usage" integer DEFAULT 0 NOT NULL;