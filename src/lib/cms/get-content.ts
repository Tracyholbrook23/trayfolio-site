import { unstable_cache } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { contentValues } from "@/lib/db/schema";

/**
 * Reads one editable field's current LIVE value.
 *
 * Cached and tagged "content:<sectionKey>" so a future publish action can
 * call revalidateTag(`content:${sectionKey}`) right after writing to the
 * database and have the site pick up the change on the next request, no
 * rebuild or redeploy. See section 8 of the architecture doc.
 *
 * `fallback` (today's hardcoded copy) is returned if the row doesn't exist
 * yet, so seeding the database is optional and the site never breaks
 * because a field hasn't been created in Postgres yet.
 */
export async function getContentValue(
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
