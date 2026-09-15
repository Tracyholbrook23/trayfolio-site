import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/auth/session-options";

/**
 * Gates everything under /client/dashboard. /client/login stays open
 * (there'd be no way to log in otherwise).
 *
 * This is the actual enforcement point, the dashboard page itself reading
 * the session is a display concern, this redirect is what a logged-out
 * visitor actually hits.
 */
export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  if (!session.userId) {
    const loginUrl = new URL("/client/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/client/dashboard/:path*"],
};
