DROP INDEX "chat_profile_id_idx";--> statement-breakpoint
DROP INDEX "chat_study_id_idx";--> statement-breakpoint
DROP INDEX "chat_created_at_idx";--> statement-breakpoint
DROP INDEX "study_profile_id_idx";--> statement-breakpoint
DROP INDEX "study_created_at_idx";--> statement-breakpoint
DROP INDEX "message_chat_id_idx";--> statement-breakpoint
DROP INDEX "message_created_at_idx";--> statement-breakpoint
DROP INDEX "note_profile_id_idx";--> statement-breakpoint
DROP INDEX "note_study_id_idx";--> statement-breakpoint
DROP INDEX "note_created_at_idx";--> statement-breakpoint
CREATE INDEX "chat_id_profile_idx" ON "lamp_chat" USING btree ("id","profile_id");--> statement-breakpoint
CREATE INDEX "chat_study_profile_created_idx" ON "lamp_chat" USING btree ("study_id","profile_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "chat_profile_created_idx" ON "lamp_chat" USING btree ("profile_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "study_profile_created_idx" ON "lamp_study" USING btree ("profile_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "study_id_profile_idx" ON "lamp_study" USING btree ("id","profile_id");--> statement-breakpoint
CREATE INDEX "message_chat_created_idx" ON "lamp_message" USING btree ("chat_id","created_at");--> statement-breakpoint
CREATE INDEX "message_id_chat_idx" ON "lamp_message" USING btree ("id","chat_id");--> statement-breakpoint
CREATE INDEX "note_study_profile_created_idx" ON "lamp_note" USING btree ("study_id","profile_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "note_profile_created_idx" ON "lamp_note" USING btree ("profile_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "note_id_profile_idx" ON "lamp_note" USING btree ("id","profile_id");--> statement-breakpoint
CREATE INDEX "subscription_user_status_idx" ON "lamp_subscription" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "subscription_user_period_idx" ON "lamp_subscription" USING btree ("user_id","current_period_end");