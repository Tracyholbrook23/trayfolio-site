import { boolean, index, integer, pgTable, serial, text, jsonb, timestamp, unique } from "drizzle-orm/pg-core";

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

/**
 * Phase 3: append-only publish history. Every time publishSectionAction
 * copies a field's draft into content_values, it also inserts one row
 * here with that same value, so this table is a running log of every
 * value a field has ever been published with, in order. No unique
 * constraint on (sectionKey, fieldKey): a field can and should have many
 * rows over time. Rollback (a later phase) is just publishing an old
 * version's value again, not a separate mechanism.
 */
export const contentVersions = pgTable("content_versions", {
  id: serial("id").primaryKey(),
  sectionKey: text("section_key").notNull(),
  fieldKey: text("field_key").notNull(),
  value: jsonb("value").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  publishedBy: text("published_by"),
});

/** Failed-login windows persist across serverless instances and deployments. */
export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: serial("id").primaryKey(),
    attemptKey: text("attempt_key").notNull(),
    attemptedAt: timestamp("attempted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("login_attempts_key_time_idx").on(table.attemptKey, table.attemptedAt)],
);

/** Append-only record of security and content mutations. */
export const auditLog = pgTable(
  "audit_log",
  {
    id: serial("id").primaryKey(),
    actorUserId: integer("actor_user_id"),
    actorEmail: text("actor_email"),
    action: text("action").notNull(),
    sectionKey: text("section_key"),
    fieldKey: text("field_key"),
    success: boolean("success").notNull().default(true),
    details: jsonb("details"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("audit_log_created_at_idx").on(table.createdAt)],
);

/**
 * A visitor who started the $50 demo form. A row is created once they give
 * their email, updated as they answer, and marked paid by the Stripe webhook.
 * Rows that never get paid drive the reminder emails in
 * /api/cron/demo-reminders, and are deleted after 30 days.
 *
 * `token` is a long random string that doubles as the key for the visitor's
 * "finish your order" and "stop reminders" links, so it is never shown
 * anywhere but their own email.
 */
export const demoLeads = pgTable(
  "demo_leads",
  {
    id: serial("id").primaryKey(),
    token: text("token").notNull().unique(),
    email: text("email").notNull(),
    name: text("name"),
    business: text("business"),
    answers: jsonb("answers").notNull(),
    /** The furthest question they reached, or "review" / "checkout". */
    step: text("step").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    remindersSent: integer("reminders_sent").notNull().default(0),
    lastReminderAt: timestamp("last_reminder_at", { withTimezone: true }),
    unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  },
  (table) => [
    index("demo_leads_email_idx").on(table.email),
    index("demo_leads_open_idx").on(table.paidAt, table.updatedAt),
  ],
);
