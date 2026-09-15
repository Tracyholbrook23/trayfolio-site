CREATE TABLE "content_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_key" text NOT NULL,
	"field_key" text NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text,
	CONSTRAINT "content_values_section_field_unique" UNIQUE("section_key","field_key")
);
