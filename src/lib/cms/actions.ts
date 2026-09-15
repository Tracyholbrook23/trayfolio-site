"use server";

import { redirect } from "next/navigation";
import { draftMode } from "next/headers";
import { updateTag } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { contentDrafts, contentValues, contentVersions } from "@/lib/db/schema";
import { contentSchema } from "@/lib/cms/content.schema";
import { validateField } from "@/lib/cms/validate";
import { requireActiveUser } from "@/lib/auth/session";
import { writeAudit } from "@/lib/cms/audit";

export interface SaveDraftState {
  error?: string;
  success?: boolean;
}

/**
 * Saves one field's draft value. Re-checks the session here independently
 * of proxy.ts, a Server Action is callable directly and must never trust
 * that middleware already gated the request, see the architecture doc's
 * defense-in-depth principle.
 *
 * Looks the field up in contentSchema itself rather than trusting
 * sectionKey/fieldKey from the form as-is, so a tampered request can't
 * write to a field that isn't part of the real schema, and always
 * validates server-side against that field's own rules before writing,
 * regardless of what the browser already checked.
 */
export async function saveDraftAction(
  _prevState: SaveDraftState,
  formData: FormData,
): Promise<SaveDraftState> {
  return saveDraft(formData);
}

/** Direct-call variant used by the visual editor on the real website. */
export async function saveInlineDraftAction(formData: FormData): Promise<SaveDraftState> {
  return saveDraft(formData);
}

async function saveDraft(formData: FormData): Promise<SaveDraftState> {
  const user = await requireActiveUser();

  const sectionKey = String(formData.get("sectionKey") || "");
  const fieldKey = String(formData.get("fieldKey") || "");
  const rawValue = String(formData.get("value") ?? "");

  const section = contentSchema.find((s) => s.key === sectionKey);
  const field = section?.fields.find((f) => f.key === fieldKey);

  if (!section || !field) {
    return { error: "That field doesn't exist." };
  }

  const result = validateField(field, rawValue);
  if (!result.valid) {
    return { error: result.error };
  }

  await db
    .insert(contentDrafts)
    .values({
      sectionKey,
      fieldKey,
      value: result.value,
      updatedBy: user.email,
    })
    .onConflictDoUpdate({
      target: [contentDrafts.sectionKey, contentDrafts.fieldKey],
      set: { value: result.value, updatedAt: new Date(), updatedBy: user.email },
    });

  await writeAudit({
    actorUserId: user.id,
    actorEmail: user.email,
    action: "DRAFT_SAVED",
    sectionKey,
    fieldKey,
  });

  return { success: true };
}

/**
 * Turns on Next.js Draft Mode and sends the client to the live homepage,
 * where getContentValue() will now read their drafts instead of the
 * published values, through the real page and components, not a
 * simulated preview.
 */
export async function enablePreviewAction(formData: FormData) {
  await requireActiveUser();

  const draft = await draftMode();
  draft.enable();
  const requestedPath = String(formData.get("path") || "/");
  const path = contentSchema.some((section) => section.path === requestedPath) ? requestedPath : "/";
  redirect(path);
}

export interface PublishState {
  error?: string;
}

export interface DiscardDraftsState {
  error?: string;
}

export async function discardSectionDraftsAction(
  _prevState: DiscardDraftsState,
  formData: FormData,
): Promise<DiscardDraftsState> {
  const user = await requireActiveUser();
  const sectionKey = String(formData.get("sectionKey") || "");
  const section = contentSchema.find((item) => item.key === sectionKey);
  if (!section) return { error: "That section doesn't exist." };

  const deleted = await db
    .delete(contentDrafts)
    .where(eq(contentDrafts.sectionKey, sectionKey))
    .returning({ id: contentDrafts.id });
  await writeAudit({ actorUserId: user.id, actorEmail: user.email, action: "DRAFTS_DISCARDED", sectionKey, details: { count: deleted.length } });
  const returnPath = String(formData.get("returnPath") || "");
  redirect(returnPath === section.path ? returnPath : `/client/dashboard/${sectionKey}`);
}

/**
 * Publishes every field in a section that currently has a draft: copies
 * each draft's value into content_values (what the public site reads),
 * logs the same value into content_versions (the publish history the
 * version history/rollback view reads from), then clears the draft row so
 * the next edit starts fresh from the newly published baseline.
 *
 * Re-checks the session itself, same defense-in-depth reasoning as
 * saveDraftAction, this is the action that actually changes what
 * visitors see, it must never rely on proxy.ts alone.
 *
 * updateTag runs once at the end so a publish takes effect on the live
 * site immediately: it's the Next.js 16 API built specifically for a
 * Server Action that needs the very next request to see the change
 * ("read-your-own-writes"), unlike revalidateTag's stale-while-revalidate
 * default. See get-content.ts for the matching cache tag.
 * Redirecting back to this same section afterward (rather than returning
 * a success state) is what clears the "Unpublished draft" tags in the
 * UI, that state is fetched fresh on the page's next render.
 */
export async function publishSectionAction(
  _prevState: PublishState,
  formData: FormData,
): Promise<PublishState> {
  const user = await requireActiveUser(["OWNER", "CLIENT_ADMIN"]);

  const sectionKey = String(formData.get("sectionKey") || "");
  const section = contentSchema.find((s) => s.key === sectionKey);
  if (!section) {
    return { error: "That section doesn't exist." };
  }

  const drafts = await db
    .select()
    .from(contentDrafts)
    .where(eq(contentDrafts.sectionKey, sectionKey));

  if (drafts.length === 0) {
    return { error: "Nothing to publish, there are no unpublished drafts in this section." };
  }

  for (const draft of drafts) {
    await db
      .insert(contentValues)
      .values({
        sectionKey: draft.sectionKey,
        fieldKey: draft.fieldKey,
        value: draft.value,
        updatedBy: user.email,
      })
      .onConflictDoUpdate({
        target: [contentValues.sectionKey, contentValues.fieldKey],
        set: { value: draft.value, updatedAt: new Date(), updatedBy: user.email },
      });

    await db.insert(contentVersions).values({
      sectionKey: draft.sectionKey,
      fieldKey: draft.fieldKey,
      value: draft.value,
      publishedBy: user.email,
    });

    await db
      .delete(contentDrafts)
      .where(
        and(
          eq(contentDrafts.sectionKey, draft.sectionKey),
          eq(contentDrafts.fieldKey, draft.fieldKey),
        ),
      );
  }

  await writeAudit({ actorUserId: user.id, actorEmail: user.email, action: "SECTION_PUBLISHED", sectionKey, details: { count: drafts.length } });

  updateTag(`content:${sectionKey}`);
  const returnPath = String(formData.get("returnPath") || "");
  const destination = returnPath === section.path ? returnPath : `/client/dashboard/${sectionKey}`;
  redirect(destination);
}

export interface RollbackState {
  error?: string;
}

/**
 * Rolls a single field back to an earlier published value. Deliberately
 * not a separate mechanism from publishing, per the schema.ts note on
 * content_versions: it just republishes an old version row's value,
 * writing it into content_values and logging a NEW content_versions row
 * for it, so a rollback shows up as its own entry in the history rather
 * than rewriting the past. That also keeps the "newest row is always
 * what's live" invariant getFieldVersions relies on intact.
 *
 * Also clears any pending draft for the field, so a half-finished edit
 * sitting in content_drafts can't get mixed up with the version the
 * client actually meant to restore.
 *
 * Re-validates the historical value against the field's CURRENT rules
 * before writing it, same defense-in-depth reasoning as every other
 * action here. A value that was valid when first published should still
 * be valid, but the schema itself can change later (e.g. a tightened
 * maxLength), and this must never write something the live schema would
 * now reject.
 */
export async function rollbackFieldAction(
  _prevState: RollbackState,
  formData: FormData,
): Promise<RollbackState> {
  const user = await requireActiveUser(["OWNER"]);

  const sectionKey = String(formData.get("sectionKey") || "");
  const fieldKey = String(formData.get("fieldKey") || "");
  const versionId = Number(formData.get("versionId"));

  const section = contentSchema.find((s) => s.key === sectionKey);
  const field = section?.fields.find((f) => f.key === fieldKey);
  if (!section || !field) {
    return { error: "That field doesn't exist." };
  }

  if (!Number.isInteger(versionId)) {
    return { error: "Invalid version." };
  }

  const [version] = await db
    .select()
    .from(contentVersions)
    .where(
      and(
        eq(contentVersions.id, versionId),
        eq(contentVersions.sectionKey, sectionKey),
        eq(contentVersions.fieldKey, fieldKey),
      ),
    )
    .limit(1);

  if (!version) {
    return { error: "That version no longer exists." };
  }

  const rawValue = typeof version.value === "string" ? version.value : String(version.value);
  const result = validateField(field, rawValue);
  if (!result.valid) {
    return { error: `That version is no longer valid: ${result.error}` };
  }

  await db
    .insert(contentValues)
    .values({
      sectionKey,
      fieldKey,
      value: result.value,
      updatedBy: user.email,
    })
    .onConflictDoUpdate({
      target: [contentValues.sectionKey, contentValues.fieldKey],
      set: { value: result.value, updatedAt: new Date(), updatedBy: user.email },
    });

  await db.insert(contentVersions).values({
    sectionKey,
    fieldKey,
    value: result.value,
    publishedBy: user.email,
  });

  await db
    .delete(contentDrafts)
    .where(and(eq(contentDrafts.sectionKey, sectionKey), eq(contentDrafts.fieldKey, fieldKey)));

  await writeAudit({ actorUserId: user.id, actorEmail: user.email, action: "FIELD_ROLLED_BACK", sectionKey, fieldKey, details: { versionId } });

  updateTag(`content:${sectionKey}`);
  redirect(`/client/dashboard/${sectionKey}`);
}
