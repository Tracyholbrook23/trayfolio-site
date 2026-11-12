import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { demoLeads } from "@/lib/db/schema";
import { readSubmission } from "@/lib/submission";
import { DEMO_FIELDS, EMPTY_ANSWERS, readDemoAnswers, type DemoAnswers } from "@/lib/demo-intake";

export const runtime = "nodejs";

/**
 * Saves a demo form that's still in progress, so a visitor who leaves can
 * get a "finish your order" reminder and pick up where they stopped.
 *
 * POST creates the row the first time (once there's an email) and returns a
 * token; later POSTs with that token update it. GET with a token returns the
 * saved answers so the form can be refilled from a reminder link. The token
 * is 32 random bytes, so knowing it is the only way to read or change a row.
 */

const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 40;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const STEPS = new Set<string>([...DEMO_FIELDS.map((field) => field.key), "review", "checkout"]);
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

function ipOf(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  if (rateLimited(ipOf(request))) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  const submission = await readSubmission(request);
  if (!submission.ok) return submission.response;
  const body = submission.data as { token?: unknown; answers?: unknown; step?: unknown; botcheck?: unknown } | null;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  // Quietly accept bot submissions without saving, so they learn nothing.
  if (body.botcheck) return NextResponse.json({ token: null });

  const parsed = readDemoAnswers(body.answers, false);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const answers = parsed.data;
  if (!answers.email) return NextResponse.json({ error: "An email is needed to save your progress." }, { status: 400 });
  const step = typeof body.step === "string" && STEPS.has(body.step) ? body.step : "email";

  try {
    const token = typeof body.token === "string" && TOKEN_PATTERN.test(body.token) ? body.token : null;
    if (token) {
      const updated = await db
        .update(demoLeads)
        .set({ email: answers.email, name: answers.name || null, business: answers.business || null, answers, step, updatedAt: new Date() })
        .where(eq(demoLeads.token, token))
        .returning({ paidAt: demoLeads.paidAt });
      if (updated.length) return NextResponse.json({ token, paid: Boolean(updated[0].paidAt) });
    }

    const fresh = crypto.randomBytes(32).toString("base64url");
    await db.insert(demoLeads).values({
      token: fresh,
      email: answers.email,
      name: answers.name || null,
      business: answers.business || null,
      answers,
      step,
    });
    return NextResponse.json({ token: fresh, paid: false });
  } catch (error) {
    // Saving progress is a nice-to-have. Never block the visitor over it.
    console.error("Could not save demo lead", error);
    return NextResponse.json({ token: null });
  }
}

export async function GET(request: Request) {
  if (rateLimited(ipOf(request))) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!TOKEN_PATTERN.test(token)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  try {
    const [lead] = await db
      .select({ answers: demoLeads.answers, step: demoLeads.step, paidAt: demoLeads.paidAt })
      .from(demoLeads)
      .where(eq(demoLeads.token, token))
      .limit(1);
    if (!lead) return NextResponse.json({ error: "Not found." }, { status: 404 });
    const saved = (lead.answers ?? {}) as Partial<DemoAnswers>;
    const answers = { ...EMPTY_ANSWERS };
    for (const field of DEMO_FIELDS) {
      const value = saved[field.key];
      if (typeof value === "string") answers[field.key] = value;
    }
    return NextResponse.json({ answers, step: lead.step, paid: Boolean(lead.paidAt) });
  } catch (error) {
    console.error("Could not load demo lead", error);
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}
