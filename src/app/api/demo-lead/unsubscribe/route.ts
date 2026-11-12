import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { demoLeads } from "@/lib/db/schema";

export const runtime = "nodejs";

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

/**
 * Stops reminder emails for one saved demo form.
 *
 * Takes the token from the query string so it also works as the target of
 * the List-Unsubscribe-Post header: Gmail and Apple Mail's built-in
 * "Unsubscribe" button POSTs straight here, form-encoded and cross-site.
 * The token is the only thing that grants anything, so there is no form
 * data to trust or check.
 */
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!TOKEN_PATTERN.test(token)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  try {
    await db.update(demoLeads).set({ unsubscribedAt: new Date() }).where(eq(demoLeads.token, token));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Could not unsubscribe demo lead", error);
    return NextResponse.json({ error: "Something went wrong. Reply to the email and I'll stop them by hand." }, { status: 500 });
  }
}
