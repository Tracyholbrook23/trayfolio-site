import type { Metadata } from "next";
import Link from "next/link";
import { requireActiveUser } from "@/lib/auth/session";
import { getAuditEntries } from "@/lib/cms/audit";

export const metadata: Metadata = { title: "Activity log | Dashboard" };

const actionLabels: Record<string, string> = {
  LOGIN_SUCCEEDED: "Logged in",
  LOGIN_FAILED: "Login failed",
  LOGIN_RATE_LIMITED: "Login blocked by rate limit",
  LOGOUT: "Logged out",
  DRAFT_SAVED: "Saved a draft",
  DRAFTS_DISCARDED: "Discarded page drafts",
  SECTION_PUBLISHED: "Published a page",
  FIELD_ROLLED_BACK: "Rolled back a field",
};

export default async function ActivityPage() {
  await requireActiveUser(["OWNER"]);
  let entries: Awaited<ReturnType<typeof getAuditEntries>> = [];
  let loadFailed = false;

  try {
    entries = await getAuditEntries();
  } catch (error) {
    loadFailed = true;
    console.error("Unable to load the CMS activity log", error);
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-16 text-stone-900">
      <div className="mx-auto max-w-3xl">
        <Link href="/client/dashboard" className="text-sm text-stone-500 underline">&larr; Dashboard</Link>
        <h1 className="mt-3 text-2xl font-semibold">Activity log</h1>
        <p className="mt-1 text-sm text-stone-600">The 100 most recent CMS and login events.</p>

        {loadFailed ? (
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
            <p className="font-medium">The activity log is temporarily unavailable.</p>
            <p className="mt-1">Your website and saved changes are unaffected. Refresh this page to try again.</p>
          </div>
        ) : entries.length === 0 ? <p className="mt-8 text-sm text-stone-500">No activity recorded yet.</p> : (
          <ul className="mt-8 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
            {entries.map((entry) => (
              <li key={entry.id} className="grid gap-1 px-4 py-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-sm font-medium">{actionLabels[entry.action] ?? entry.action}</p>
                  <p className="text-xs text-stone-500">
                    {entry.actorEmail ?? "Unknown user"}
                    {entry.sectionKey ? ` · ${entry.sectionKey}${entry.fieldKey ? `.${entry.fieldKey}` : ""}` : ""}
                  </p>
                </div>
                <time className="text-xs text-stone-500" dateTime={entry.createdAt.toISOString()}>{entry.createdAt.toLocaleString()}</time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
