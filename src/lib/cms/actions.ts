"use server";

import { redirect } from "next/navigation";
import { draftMode } from "next/headers";
import { updateTag } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { contentDrafts, contentValues, contentVersions } from "@/lib/db/schema";
import { contentSchema } from "@/lib/cms/content.schema";
import { validateField } from "@/lib/cms/validate";
import { getSession } from "@/lib/auth/session";

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
  const session = await getSession();
  if (!session.userId) {
    redirect("/client/login");
  }

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
      updatedBy: session.email,
    })
    .onConflictDoUpdate({
      target: [contentDrafts.sectionKey, contentDrafts.fieldKey],
      set: { value: result.value, updatedAt: new Date(), updatedBy: session.email },
    });

  return { success: true };
}

/**
 * Turns on Next.js Draft Mode and sends the client to the live homepage,
 * where getContentValue() will now read their drafts instead of the
 * published values, through the real page and components, not a
 * simulated preview.
 */
export async function enablePreviewAction() {
  const session = await getSession();
  if (!session.userId) {
    redirect("/client/login");
  }

  const draft = await draftMode();
  draft.enable();
  redirect("/");
}

/**
 * Called from the PreviewBanner shown site-wide while Draft Mode is on.
 * No session check needed to turn preview off, exiting preview can never
 * expose or change anything, only stop showing drafts.
 */
export async function exitPreviewAction() {
  const draft = await draftMode();
  draft.disable();
  redirect("/");
}


export interface PublishState {
  error?: string;
}

/**
 * Publishes every field in a section that currently has a draft: copies
 * each draft's value into content_values (what the public site reads),
 * logs the same value into content_versions (the publish history a later
 * rollback feature will read from), then clears the draft row so the next
 * edit starts fresh from the newly published baseline.
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
  const session = await getSession();
  if (!session.userId) {
    redirect("/client/login");
  }

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
        updatedBy: session.email,
      })
      .onConflictDoUpdate({
        target: [contentValues.sectionKey, contentValues.fieldKey],
        set: { value: draft.value, updatedAt: new Date(), updatedBy: session.email },
      });

    await db.insert(contentVersions).values({
      sectionKey: draft.sectionKey,
      fieldKey: draft.fieldKey,
      value: draft.value,
      publishedBy: session.email,
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

  updateTag(`content:${sectionKey}`);
  redirect(`/client/dashboard/${sectionKey}`);
}
