import { draftMode } from "next/headers";
import { exitPreviewAction } from "@/lib/cms/actions";

/**
 * Shown across the whole site whenever Draft Mode is on, so a client
 * previewing unpublished edits can never mistake the preview for the live
 * site, and always has a one-click way back to normal browsing.
 */
export async function PreviewBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <div className="sticky top-0 z-[200] flex items-center justify-center gap-3 bg-amber-400 px-4 py-2 text-sm font-medium text-stone-900">
      <span>Preview mode: viewing unpublished changes.</span>
      <form action={exitPreviewAction}>
        <button type="submit" className="underline">
          Exit preview
        </button>
      </form>
    </div>
  );
}
