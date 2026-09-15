"use client";

import { useActionState } from "react";
import { rollbackFieldAction, type RollbackState } from "@/lib/cms/actions";

const initialState: RollbackState = {};

/**
 * Republishes one earlier version's value. A native confirm dialog guards
 * it for the same reason as PublishSectionButton, this immediately
 * changes what visitors see, and there's no separate "are you sure" step
 * in the dashboard UI itself yet.
 */
export function RollbackFieldButton({
  sectionKey,
  fieldKey,
  versionId,
}: {
  sectionKey: string;
  fieldKey: string;
  versionId: number;
}) {
  const [state, formAction, pending] = useActionState(rollbackFieldAction, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (
          !window.confirm("Roll back to this version? This updates the live site immediately.")
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="sectionKey" value={sectionKey} />
      <input type="hidden" name="fieldKey" value={fieldKey} />
      <input type="hidden" name="versionId" value={versionId} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs font-medium text-stone-700 underline disabled:opacity-50"
      >
        {pending ? "Rolling back..." : "Roll back to this"}
      </button>
      {state.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
