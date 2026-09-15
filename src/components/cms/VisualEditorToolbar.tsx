"use client";

import Link from "next/link";
import { useActionState } from "react";
import { usePathname } from "next/navigation";
import { discardSectionDraftsAction, enablePreviewAction, publishSectionAction, type DiscardDraftsState, type PublishState } from "@/lib/cms/actions";
import { logout } from "@/lib/auth/actions";
import { contentSchema } from "@/lib/cms/content.schema";
import type { Role } from "@/lib/auth/session-options";

export function VisualEditorToolbar({ role, previewing, draftCount }: { role?: Role; previewing: boolean; draftCount: number }) {
  const pathname = usePathname();
  const section = contentSchema.find((item) => item.path === pathname);
  const [publishState, publishAction, publishing] = useActionState<PublishState, FormData>(publishSectionAction, {});
  const [discardState, discardAction, discarding] = useActionState<DiscardDraftsState, FormData>(discardSectionDraftsAction, {});
  if (pathname.startsWith("/client/")) return null;

  const canPublish = role === "OWNER" || role === "CLIENT_ADMIN";
  return (
    <aside className="fixed inset-x-3 bottom-3 z-[250] mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white shadow-2xl" aria-label="Website editor">
      <div>
        <p className="font-semibold">{previewing ? "Edit mode" : "Editor paused"}</p>
        <p className="text-xs text-stone-400">{previewing ? `${draftCount} unpublished ${draftCount === 1 ? "change" : "changes"} · Click highlighted text to edit.` : "Turn edit mode on to see saved drafts."}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {publishState.error || discardState.error ? <span role="alert" className="text-xs text-amber-300">{publishState.error ?? discardState.error}</span> : null}
        {!previewing ? <form action={enablePreviewAction}><input type="hidden" name="path" value={section?.path ?? "/"} /><button type="submit" className="rounded-lg bg-white px-3 py-2 font-semibold text-stone-900">Enter edit mode</button></form> : null}
        {previewing && section && draftCount > 0 ? <form action={discardAction}><input type="hidden" name="sectionKey" value={section.key} /><input type="hidden" name="returnPath" value={section.path} /><button type="submit" disabled={discarding} onClick={(event) => { if (!window.confirm(`Discard all ${draftCount} unpublished changes on this page?`)) event.preventDefault(); }} className="rounded-lg border border-stone-600 px-3 py-2 disabled:opacity-50">{discarding ? "Discarding…" : "Discard drafts"}</button></form> : null}
        {previewing && section && canPublish ? <form action={publishAction}><input type="hidden" name="sectionKey" value={section.key} /><input type="hidden" name="returnPath" value={section.path} /><button type="submit" disabled={publishing || draftCount === 0} className="rounded-lg bg-terracotta px-3 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{publishing ? "Publishing…" : "Publish page"}</button></form> : null}
        <Link href="/client/dashboard" className="rounded-lg border border-stone-600 px-3 py-2">Dashboard</Link>
        <form action={logout}><button type="submit" className="rounded-lg border border-stone-600 px-3 py-2">Exit editor</button></form>
      </div>
    </aside>
  );
}
