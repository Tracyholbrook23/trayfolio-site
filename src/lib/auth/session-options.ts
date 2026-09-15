import type { SessionOptions } from "iron-session";

// Deliberately no "server-only" or next/headers import here: this file is
// shared by both src/lib/auth/session.ts (Server Components/Actions,
// Node runtime) and middleware.ts (Edge runtime), and next/headers isn't
// valid in the Edge runtime's middleware context.

export type Role = "OWNER" | "CLIENT_ADMIN" | "CLIENT_EDITOR";

export interface SessionData {
  userId?: number;
  email?: string;
  role?: Role;
}

function requireSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or too short (needs 32+ characters). Add it to .env.local " +
        "for local dev, and to the Vercel project's Environment Variables for production.",
    );
  }
  return secret;
}

/**
 * The cookie only carries userId/email/role as a UI hint (so the dashboard
 * can show "logged in as..." without a database round trip on every
 * render). It is never the source of truth for an authorization decision,
 * any Server Action that changes something re-reads the user's role from
 * the `users` table first. See section 3 of the architecture doc.
 */
export const sessionOptions: SessionOptions = {
  password: requireSessionSecret(),
  cookieName: "trayfolio_client_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
  },
};
