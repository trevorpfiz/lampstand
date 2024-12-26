CREATE TYPE "public"."pricing_plan_interval" AS ENUM('day', 'week', 'month', 'year');--> statement-breakpoint
CREATE TYPE "public"."pricing_type" AS ENUM('one_time', 'recurring');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');--> statement-breakpoint
CREATE TABLE "lamp_customer" (
	"id" uuid PRIMARY KEY NOT NULL,
	"stripe_customer_id" text
);
--> statement-breakpoint
CREATE TABLE "lamp_price" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text,
	"active" boolean,
	"description" text,
	"unit_amount" bigint,
	"currency" text,
	"type" "pricing_type",
	"interval" "pricing_plan_interval",
	"interval_count" integer,
	"trial_period_days" integer,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "lamp_product" (
	"id" text PRIMARY KEY NOT NULL,
	"active" boolean,
	"name" text,
	"description" text,
	"image" text,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "lamp_subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"status" "subscription_status",
	"metadata" jsonb,
	"price_id" text,
	"quantity" integer,
	"cancel_at_period_end" boolean,
	"created" timestamp with time zone DEFAULT now(),
	"current_period_start" timestamp with time zone DEFAULT now(),
	"current_period_end" timestamp with time zone DEFAULT now(),
	"ended_at" timestamp with time zone DEFAULT now(),
	"cancel_at" timestamp with time zone DEFAULT now(),
	"canceled_at" timestamp with time zone DEFAULT now(),
	"trial_start" timestamp with time zone DEFAULT now(),
	"trial_end" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "lamp_profile" ADD COLUMN "billing_address" jsonb;--> statement-breakpoint
ALTER TABLE "lamp_profile" ADD COLUMN "payment_method" jsonb;--> statement-breakpoint
ALTER TABLE "lamp_customer" ADD CONSTRAINT "lamp_customer_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lamp_price" ADD CONSTRAINT "lamp_price_product_id_lamp_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."lamp_product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lamp_subscription" ADD CONSTRAINT "lamp_subscription_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lamp_subscription" ADD CONSTRAINT "lamp_subscription_price_id_lamp_price_id_fk" FOREIGN KEY ("price_id") REFERENCES "public"."lamp_price"("id") ON DELETE no action ON UPDATE no action;