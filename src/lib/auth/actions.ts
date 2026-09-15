"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { getSession, type Role } from "@/lib/auth/session";

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

  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const user = rows[0];

  if (!user || user.disabledAt) {
    return { error: genericError };
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);
  if (!passwordMatches) {
    return { error: genericError };
  }

  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  session.role = user.role as Role;
  await session.save();

  redirect("/client/dashboard");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/client/login");
}
