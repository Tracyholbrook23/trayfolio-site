CREATE TABLE "content_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_key" text NOT NULL,
	"field_key" text NOT NULL,
	"value" jsonb NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_by" text
);
