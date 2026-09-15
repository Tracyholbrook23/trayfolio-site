"use client";

import { useActionState, useState } from "react";
import type { FieldDef } from "@/lib/cms/content.schema";
import { saveDraftAction, type SaveDraftState } from "@/lib/cms/actions";

const initialState: SaveDraftState = {};

/**
 * One field's editing UI: renders the right input for the field's type,
 * enforces the same maxLength client-side as a UX nicety only, and shows
 * whatever saveDraftAction's real server-side validation comes back with.
 * The browser's own constraints are never the actual protection, see
 * validate.ts.
 *
 * The input is a controlled component (value/onChange, not defaultValue)
 * on purpose: React resets uncontrolled form fields back to their
 * original value after a `<form action>` submission succeeds, which would
 * otherwise make a saved draft visually snap back to the old text right
 * after "Save draft" actually worked.
 */
export function SectionEditorForm({
  sectionKey,
  field,
  initialValue,
  isDraft,
}: {
  sectionKey: string;
  field: FieldDef;
  initialValue: string;
  isDraft: boolean;
}) {
  const [state, formAction, pending] = useActionState(saveDraftAction, initialState);
  const [value, setValue] = useState(initialValue);

  return (
    <form action={formAction} className="rounded-lg border border-stone-200 bg-white p-4">
      <input type="hidden" name="sectionKey" value={sectionKey} />
      <input type="hidden" name="fieldKey" value={field.key} />

      <div className="flex items-start justify-between gap-4">
        <label htmlFor={field.key} className="block text-sm font-medium text-stone-900">
          {field.label}
          {field.required && <span className="text-red-600"> *</span>}
        </label>
        <a
          href={`/client/dashboard/${sectionKey}/${field.key}/history`}
          className="shrink-0 text-xs text-stone-500 underline"
        >
          View history
        </a>
      </div>
      {field.helpText && <p className="mt-1 text-xs text-stone-500">{field.helpText}</p>}

      {field.type === "textarea" ? (
        <textarea
          id={field.key}
          name="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={field.maxLength}
          rows={4}
          className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
      ) : (
        <input
          id={field.key}
          name="value"
          type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={field.maxLength}
          className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
      )}

      <div className="mt-3 flex items-center justify-between">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save draft"}
        </button>
        {isDraft && <span className="text-xs text-amber-600">Unpublished draft</span>}
      </div>

      {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="mt-2 text-sm text-green-600">Draft saved.</p>}
    </form>
  );
}
