import { pgTable, serial, text, jsonb, timestamp, unique } from "drizzle-orm/pg-core";

/**
 * The site's LIVE, published content. One row per editable field, keyed by
 * (sectionKey, fieldKey) so it lines up 1:1 with a FieldDef in
 * src/lib/cms/content.schema.ts.
 *
 * Phase 0 scope: this was the only table for a while. content_drafts,
 * content_versions, media_assets, and audit_log still get added in later
 * phases as the dashboard actually needs them, see
 * /areas/client-cms-system.md for the full plan.
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

/**
 * Phase 1: who can log in to /client/dashboard, and what they're allowed to
 * do once there. Role is checked server-side from THIS table on every
 * privileged action, the session cookie's role claim is only a UI hint,
 * never trusted on its own for anything destructive (see section 3 of the
 * architecture doc).
 *
 * No self-signup anywhere in this system: accounts are created by an OWNER
 * (today, via scripts/create-user.mjs), never by someone registering
 * themselves.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["OWNER", "CLIENT_ADMIN", "CLIENT_EDITOR"] }).notNull(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  disabledAt: timestamp("disabled_at", { withTimezone: true }),
});

/**
 * Phase 2: unpublished edits, one row per (sectionKey, fieldKey) exactly
 * like content_values. A field with no draft row here just isn't being
 * edited right now, the live site (and dashboard) fall back to
 * content_values for it. Publishing (a later phase) will copy a section's
 * drafts into content_values and clear them.
 */
export const contentDrafts = pgTable(
  "content_drafts",
  {
    id: serial("id").primaryKey(),
    sectionKey: text("section_key").notNull(),
    fieldKey: text("field_key").notNull(),
    value: jsonb("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    updatedBy: text("updated_by"),
  },
  (table) => [unique("content_drafts_section_field_unique").on(table.sectionKey, table.fieldKey)],
);
