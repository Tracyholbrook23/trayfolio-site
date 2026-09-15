import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { logout } from "@/lib/auth/actions";
import { enablePreviewAction } from "@/lib/cms/actions";
import { contentSchema } from "@/lib/cms/content.schema";

export const metadata: Metadata = { title: "Dashboard | Trayfolio" };

/**
 * Section list, generated entirely from contentSchema. This page (and the
 * editor behind each link) has no built-in knowledge of what sections or
 * fields exist on this particular site, see content.schema.ts. Adding a
 * new site's content just means writing a new content.schema.ts, this
 * dashboard doesn't change.
 */
export default async function ClientDashboardPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-16">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-stone-900">Client dashboard</h1>
          <form action={logout}>
            <button type="submit" className="text-sm font-medium text-stone-500 underline">
              Log out
            </button>
          </form>
        </div>
        <p className="mt-1 text-sm text-stone-600">
          Signed in as {session.email} ({session.role})
        </p>
        {session.role === "OWNER" ? (
          <Link href="/client/dashboard/activity" className="mt-3 inline-block text-sm font-medium text-stone-600 underline">
            View activity log
          </Link>
        ) : null}

        <ul className="mt-8 space-y-3">
          {contentSchema.map((section) => (
            <li key={section.key}>
              <Link
                href={`/client/dashboard/${section.key}`}
                className="block rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-900 hover:border-stone-300"
              >
                <span>{section.label}</span>
                <span className="mt-1 block text-xs font-normal text-stone-500">
                  {section.fields.length} editable fields
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <form action={enablePreviewAction} className="mt-8">
          <input type="hidden" name="path" value="/" />
          <button
            type="submit"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
          >
            Open visual website editor
          </button>
        </form>
      </div>
    </div>
  );
}
