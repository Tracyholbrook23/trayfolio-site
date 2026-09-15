import { pgTable, serial, text, jsonb, timestamp, unique } from "drizzle-orm/pg-core";

/**
 * The site's LIVE, published content. One row per editable field, keyed by
 * (sectionKey, fieldKey) so it lines up 1:1 with a FieldDef in
 * src/lib/cms/content.schema.ts.
 *
 * Phase 0 scope: this is the only table that exists so far. content_drafts,
 * content_versions, media_assets, users, and audit_log get added in later
 * phases as the dashboard actually needs them, see
 * /areas/client-cms-system.md for the full plan. Deliberately not building
 * all six tables up front before anything reads or writes to them.
 */
export const contentValues = pgTable(
  "content_values",
  {
    id: serial("id").primaryKey(),
    sectionKey: text("section_key").notNull(),
    fieldKey: text("field_key").notNull(),
    value: jsonb("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    updatedBy: text("updated_by"),
  },
  (table) => [unique("content_values_section_field_unique").on(table.sectionKey, table.fieldKey)],
);
