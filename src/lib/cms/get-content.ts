import "server-only";
import { draftMode } from "next/headers";
import { unstable_cache } from "next/cache";
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { contentValues, contentDrafts, contentVersions } from "@/lib/db/schema";

/**
 * Reads one editable field's current value for rendering the public site.
 *
 * Normally reads the LIVE value from content_values, cached and tagged
 * "content:<sectionKey>" so a future publish action can call
 * revalidateTag(`content:${sectionKey}`) right after writing to the
 * database and have the site pick up the change on the next request, no
 * rebuild or redeploy. See section 8 of the architecture doc.
 *
 * When Next.js Draft Mode is on (the dashboard's preview button), this
 * instead looks for an unpublished draft row for the same field and
 * returns that, so a client previews their edit through the real
 * page/components rather than a simulated preview. Draft Mode already
 * disables the Next.js data cache, and a draft read here skips
 * unstable_cache entirely too, so a preview never serves a stale value. A
 * field with no draft yet (nothing saved this editing session) just falls
 * through to the live value, so previewing one edited field doesn't blank
 * out the rest of the page.
 *
 * `fallback` (today's hardcoded copy) is returned if neither a draft nor a
 * live row exists yet, so seeding the database is optional and the site
 * never breaks because a field hasn't been created in Postgres yet.
 */
export async function getContentValue(
  sectionKey: string,
  fieldKey: string,
  fallback: string,
): Promise<string> {
  const { isEnabled: previewing } = await draftMode();

  if (previewing) {
    const draftValue = await readDraftValue(sectionKey, fieldKey);
    if (draftValue !== null) return draftValue;
  }

  return getPublishedValue(sectionKey, fieldKey, fallback);
}

async function readDraftValue(sectionKey: string, fieldKey: string): Promise<string | null> {
  const rows = await db
    .select({ value: contentDrafts.value })
    .from(contentDrafts)
    .where(and(eq(contentDrafts.sectionKey, sectionKey), eq(contentDrafts.fieldKey, fieldKey)))
    .limit(1);

  return typeof rows[0]?.value === "string" ? rows[0].value : null;
}

async function getPublishedValue(
  sectionKey: string,
  fieldKey: string,
  fallback: string,
): Promise<string> {
  const readCached = unstable_cache(
    async () => {
      const rows = await db
        .select({ value: contentValues.value })
        .from(contentValues)
        .where(and(eq(contentValues.sectionKey, sectionKey), eq(contentValues.fieldKey, fieldKey)))
        .limit(1);

      return rows[0]?.value ?? null;
    },
    ["content-value", sectionKey, fieldKey],
    { tags: [`content:${sectionKey}`] },
  );

  const value = await readCached();
  return typeof value === "string" ? value : fallback;
}

/**
 * Dashboard-only read: always fresh (no cache), and reports whether the
 * value being shown is a pending draft or the last published value, so the
 * editor can prefill a field and still tell the client which one they're
 * looking at. Never used by the public site.
 */
export async function getEditableValue(
  sectionKey: string,
  fieldKey: string,
  fallback: string,
): Promise<{ value: string | null; isDraft: boolean }> {
  const draftValue = await readDraftValue(sectionKey, fieldKey);
  if (draftValue !== null) return { value: draftValue, isDraft: true };

  const rows = await db
    .select({ value: contentValues.value })
    .from(contentValues)
    .where(and(eq(contentValues.sectionKey, sectionKey), eq(contentValues.fieldKey, fieldKey)))
    .limit(1);

  const value = rows[0]?.value;
  return { value: typeof value === "string" ? value : fallback, isDraft: false };
}

/** Reads a whole schema section in parallel using its safe defaults. */
export async function getSectionContent(sectionKey: string): Promise<Record<string, string>> {
  const { getSectionDef } = await import("@/lib/cms/content.schema");
  const section = getSectionDef(sectionKey);
  if (!section) throw new Error(`Unknown CMS section: ${sectionKey}`);

  const entries = await Promise.all(
    section.fields.map(async (field) => [
      field.key,
      await getContentValue(sectionKey, field.key, field.defaultValue),
    ] as const),
  );
  return Object.fromEntries(entries);
}

export async function getSectionDraftCount(sectionKey: string): Promise<number> {
  const [row] = await db
    .select({ count: count() })
    .from(contentDrafts)
    .where(eq(contentDrafts.sectionKey, sectionKey));
  return row?.count ?? 0;
}

export interface FieldVersion {
  id: number;
  value: string;
  publishedAt: Date;
  publishedBy: string | null;
}

/**
 * Dashboard-only read: every value this field has ever been published
 * with, most recent first. Backs the version history/rollback view.
 * Always fresh (no cache), same reasoning as getEditableValue, a client
 * who just rolled back needs to see that show up immediately. Never used
 * by the public site.
 *
 * content_versions is append-only (see schema.ts) and both
 * publishSectionAction and rollbackFieldAction insert a row here every
 * time they touch content_values, so the newest row returned is always
 * what's currently live, that invariant is what lets the history page
 * label versions[0] as "Current" without a separate lookup.
 */
export async function getFieldVersions(
  sectionKey: string,
  fieldKey: string,
  limit = 50,
): Promise<FieldVersion[]> {
  const rows = await db
    .select({
      id: contentVersions.id,
      value: contentVersions.value,
      publishedAt: contentVersions.publishedAt,
      publishedBy: contentVersions.publishedBy,
    })
    .from(contentVersions)
    .where(and(eq(contentVersions.sectionKey, sectionKey), eq(contentVersions.fieldKey, fieldKey)))
    .orderBy(desc(contentVersions.publishedAt), desc(contentVersions.id))
    .limit(limit);

  return rows.map((row) => ({
    ...row,
    value: typeof row.value === "string" ? row.value : String(row.value),
  }));
}
