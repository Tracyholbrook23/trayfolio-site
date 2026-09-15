import "server-only";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type Role, type SessionData } from "./session-options";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

export type { Role, SessionData } from "./session-options";

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

/**
 * Security boundary for mutations. The cookie identifies a candidate user;
 * current role and disabled status always come from the database.
 */
export async function requireActiveUser(allowedRoles?: Role[]) {
  const session = await getSession();
  if (!session.userId) redirect("/client/login");

  const [user] = await db.select({
    id: users.id,
    email: users.email,
    role: users.role,
    disabledAt: users.disabledAt,
  }).from(users).where(eq(users.id, session.userId)).limit(1);

  if (!user || user.disabledAt) {
    session.destroy();
    redirect("/client/login");
  }

  const role = user.role as Role;
  if (allowedRoles && !allowedRoles.includes(role)) {
    throw new Error("You do not have permission to perform this action.");
  }

  return { id: user.id, email: user.email, role };
}
