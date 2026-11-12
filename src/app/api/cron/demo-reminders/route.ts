import { NextResponse } from "next/server";
import { and, eq, inArray, isNotNull, isNull, lt, gt } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { demoLeads } from "@/lib/db/schema";
import { emailConfigured, sendEmail } from "@/lib/email";
import { ownerSummary, reminderEmail } from "@/lib/demo-reminder-emails";

type Lead = typeof demoLeads.$inferSelect;

export const runtime = "nodejs";

/**
 * Runs once a day (see vercel.json). Finds visitors who gave their email in
 * the demo form but never paid, and sends at most two friendly reminders:
 *
 *   1st: the next run after they've been gone at least an hour
 *   2nd: three days after the first, and it says it's the last one
 *
 * Nobody is emailed if they paid (on any saved form with that email), asked
 * to stop, or started more than 14 days ago. Tracy gets a summary of who was
 * reminded, with their answers, so she can reach out personally too.
 * Unfinished forms older than 30 days are deleted, as the privacy policy says.
 *
 * Vercel calls this with `Authorization: Bearer $CRON_SECRET`. Without
 * CRON_SECRET set, the route refuses to run so nobody else can trigger it.
 */

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const MAX_PER_RUN = 50;


export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET is not set." }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!emailConfigured()) return NextResponse.json({ error: "Email is not configured." }, { status: 503 });

  const now = Date.now();

  // Housekeeping first: unfinished forms don't stick around.
  await db.delete(demoLeads).where(and(isNull(demoLeads.paidAt), lt(demoLeads.createdAt, new Date(now - 30 * DAY))));

  const open = await db
    .select()
    .from(demoLeads)
    .where(
      and(
        isNull(demoLeads.paidAt),
        isNull(demoLeads.unsubscribedAt),
        gt(demoLeads.createdAt, new Date(now - 14 * DAY)),
        lt(demoLeads.remindersSent, 2),
      ),
    );

  if (open.length === 0) return NextResponse.json({ reminded: 0 });

  // Skip anyone who has since paid on another form, or who asked to stop on one.
  const emails = [...new Set(open.map((lead) => lead.email.toLowerCase()))];
  const settled = await db
    .select({ email: demoLeads.email })
    .from(demoLeads)
    .where(and(inArray(demoLeads.email, open.map((lead) => lead.email)), isNotNull(demoLeads.paidAt)));
  const stopped = await db
    .select({ email: demoLeads.email })
    .from(demoLeads)
    .where(and(inArray(demoLeads.email, open.map((lead) => lead.email)), isNotNull(demoLeads.unsubscribedAt)));
  const skip = new Set([...settled, ...stopped].map((row) => row.email.toLowerCase()));

  // One reminder per person: if they started twice, use the latest form.
  const latest = new Map<string, Lead>();
  for (const lead of open) {
    const key = lead.email.toLowerCase();
    if (skip.has(key)) continue;
    const current = latest.get(key);
    if (!current || lead.updatedAt > current.updatedAt) latest.set(key, lead);
  }

  const due = [...latest.values()]
    .filter((lead) =>
      lead.remindersSent === 0
        ? now - lead.updatedAt.getTime() >= HOUR
        : lead.lastReminderAt !== null && now - lead.lastReminderAt.getTime() >= 3 * DAY,
    )
    .slice(0, MAX_PER_RUN);

  const reminded: Lead[] = [];
  for (const lead of due) {
    const sent = await sendEmail(reminderEmail(lead));
    if (!sent) continue;
    await db
      .update(demoLeads)
      .set({ remindersSent: lead.remindersSent + 1, lastReminderAt: new Date() })
      .where(eq(demoLeads.id, lead.id));
    reminded.push(lead);
  }

  const alertTo = process.env.ALERT_EMAIL;
  if (alertTo && reminded.length) await sendEmail(ownerSummary(alertTo, reminded));

  return NextResponse.json({ checked: emails.length, reminded: reminded.length });
}
