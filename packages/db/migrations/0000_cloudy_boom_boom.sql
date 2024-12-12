CREATE TABLE "lamp_profile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"image" varchar(256),
	"email" varchar(256)
);
--> statement-breakpoint
ALTER TABLE "lamp_profile" ADD CONSTRAINT "lamp_profile_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "name_idx" ON "lamp_profile" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "lamp_profile" USING btree ("email");