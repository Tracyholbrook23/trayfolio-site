CREATE TABLE "demo_leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"business" text,
	"answers" jsonb NOT NULL,
	"step" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone,
	"reminders_sent" integer DEFAULT 0 NOT NULL,
	"last_reminder_at" timestamp with time zone,
	"unsubscribed_at" timestamp with time zone,
	CONSTRAINT "demo_leads_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE INDEX "demo_leads_email_idx" ON "demo_leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "demo_leads_open_idx" ON "demo_leads" USING btree ("paid_at","updated_at");