"use client";

import { useActionState } from "react";
import { publishSectionAction, type PublishState } from "@/lib/cms/actions";

const initialState: PublishState = {};

/**
 * Publishes every drafted field in this section at once. A native confirm
 * dialog guards it since, unlike "Save draft", this immediately changes
 * what visitors see, there is no separate "are you sure" step in the
 * dashboard UI itself yet.
 */
export function PublishSectionButton({ sectionKey }: { sectionKey: string }) {
  const [state, formAction, pending] = useActionState(publishSectionAction, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (
          !window.confirm(
            "Publish all saved drafts in this section? This updates the live site immediately.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="sectionKey" value={sectionKey} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Publishing..." : "Publish section"}
      </button>
      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
