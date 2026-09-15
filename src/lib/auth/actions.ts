"use server";

import { redirect } from "next/navigation";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { createHash } from "node:crypto";
import { draftMode, headers } from "next/headers";
import { db } from "@/lib/db/client";
import { loginAttempts, users } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { getSession, type Role } from "@/lib/auth/session";
import { writeAudit } from "@/lib/cms/audit";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_FAILURES = 5;
const DUMMY_PASSWORD_HASH = "$2b$12$JKtwXD/j2H0.MLw0.N3f1egShFHGNhUyw6g1STzYiyLQ98jc0fgVa";

export interface LoginState {
  error?: string;
}

/**
 * No self-signup anywhere: accounts are created ahead of time by an OWNER
 * (scripts/create-user.mjs for now). This just checks a submitted
 * email/password against the users table and starts a session.
 *
 * Same generic error whether the email doesn't exist, the account is
 * disabled, or the password is wrong, so a login attempt can't be used to
 * discover which emails have accounts on this site.
 */
export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const genericError = "Incorrect email or password.";

  if (!email || !password) {
    return { error: genericError };
  }

  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientAddress = forwardedFor || headerStore.get("x-real-ip") || "local";
  const attemptKey = createHash("sha256").update(`${clientAddress}|${email}`).digest("hex");
  const windowStart = new Date(Date.now() - LOGIN_WINDOW_MS);
  const [{ failures }] = await db
    .select({ failures: count() })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.attemptKey, attemptKey), gte(loginAttempts.attemptedAt, windowStart)));

  if (failures >= MAX_LOGIN_FAILURES) {
    await writeAudit({ actorEmail: email, action: "LOGIN_RATE_LIMITED", success: false });
    return { error: "Too many login attempts. Try again in 15 minutes." };
  }

  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const user = rows[0];

  const passwordMatches = await verifyPassword(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);
  if (!user || user.disabledAt || !passwordMatches) {
    await db.insert(loginAttempts).values({ attemptKey });
    await writeAudit({ actorEmail: email, action: "LOGIN_FAILED", success: false });
    return { error: genericError };
  }

  await db.delete(loginAttempts).where(eq(loginAttempts.attemptKey, attemptKey));
  await db.delete(loginAttempts).where(lt(loginAttempts.attemptedAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));
  await writeAudit({ actorUserId: user.id, actorEmail: user.email, action: "LOGIN_SUCCEEDED" });

  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  session.role = user.role as Role;
  await session.save();

  const draft = await draftMode();
  draft.enable();
  redirect("/");
}

export async function logout() {
  const session = await getSession();
  if (session.userId) {
    await writeAudit({ actorUserId: session.userId, actorEmail: session.email, action: "LOGOUT" });
  }
  session.destroy();
  const draft = await draftMode();
  draft.disable();
  redirect("/client/login");
}
