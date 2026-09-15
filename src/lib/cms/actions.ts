"use server";

import { redirect } from "next/navigation";
import { draftMode } from "next/headers";
import { db } from "@/lib/db/client";
import { contentDrafts } from "@/lib/db/schema";
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
