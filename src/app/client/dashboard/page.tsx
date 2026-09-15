import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { logout } from "@/lib/auth/actions";

export const metadata: Metadata = { title: "Dashboard | Trayfolio" };

/**
 * Phase 1 placeholder: proves the login -> session -> protected route loop
 * works end to end. middleware.ts is what actually keeps a logged-out
 * visitor out of here, this page just displays who's signed in. The real
 * schema-driven content editor replaces this in phase 2.
 */
export default async function ClientDashboardPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="text-xl font-semibold text-stone-900">Client dashboard</h1>
        <p className="mt-2 text-sm text-stone-600">
          Logged in as <strong>{session.email}</strong> ({session.role}).
        </p>
        <p className="mt-4 text-sm text-stone-500">
          This is a placeholder. The real content editor (built from
          content.schema.ts) arrives in phase 2.
        </p>
        <form action={logout} className="mt-8">
          <button
            type="submit"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
          >
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
