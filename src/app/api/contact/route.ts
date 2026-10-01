import { highLevelConfigured, pushLead, type Lead } from "@/lib/highlevel";
import { readSubmission } from "@/lib/submission";
import { NextResponse } from "next/server";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const PROJECT_TYPES = new Set([
  "New website",
  "Redesign",
  "Online store / payments",
  "Booking or lead-generation site",
  "Ongoing website support",
  "Not sure yet",
]);
const submissions = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 4;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  submissions.set(ip, recent);
  if (submissions.size > 5_000) submissions.clear();
  return recent.length > MAX_PER_WINDOW;
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim().length <= maxLength ? value.trim() : null;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Please try again in a minute." }, { status: 429 });
  }

  const submission = await readSubmission(request);
  if (!submission.ok) return submission.response;
  const body = submission.data;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = text(input.name, 100);
  const email = text(input.email, 254);
  const phone = text(input.phone ?? "", 40);
  const business = text(input.business ?? "", 150);
  const message = text(input.message, 3_000);
  const botcheck = input.botcheck;
  const rawTypes = input.projectType;

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a name, valid email, and message." }, { status: 400 });
  }
  if (phone === null || business === null) {
    return NextResponse.json({ error: "Please shorten the phone or business field." }, { status: 400 });
  }
  if (botcheck) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }
  if (!Array.isArray(rawTypes) || rawTypes.length > PROJECT_TYPES.size || rawTypes.some((item) => typeof item !== "string" || !PROJECT_TYPES.has(item))) {
    return NextResponse.json({ error: "Invalid project type." }, { status: 400 });
  }

  const projectTypes = rawTypes as string[];
  const smsConsent = input.smsConsent === true;
  const lead: Lead = {
    name,
    email,
    phone: phone || "",
    business: business || "",
    projectTypes,
    message,
    smsConsent,
  };

  const emailReady = Boolean(process.env.WEB3FORMS_ACCESS_KEY || (process.env.RESEND_API_KEY && process.env.DEMO_EMAIL_FROM));
  const crmReady = highLevelConfigured();
  if (!emailReady && !crmReady) {
    return NextResponse.json({ error: "Contact form is not configured." }, { status: 503 });
  }

  // Email Tracy and push the lead into HighLevel at the same time. Either one landing
  // counts as delivered, so a HighLevel outage never loses an inquiry and vice versa.
  const [emailResult, crmResult] = await Promise.allSettled([
    emailReady ? sendInquiryEmail(lead) : Promise.resolve(false),
    crmReady ? pushLead(lead) : Promise.resolve(null),
  ]);
  if (emailResult.status === "rejected") console.error("Inquiry email failed:", emailResult.reason);
  if (crmResult.status === "rejected") console.error("HighLevel lead push failed:", crmResult.reason);

  const emailed = emailResult.status === "fulfilled" && emailResult.value === true;
  const synced = crmResult.status === "fulfilled" && Boolean(crmResult.value);
  if (!emailed && !synced) {
    return NextResponse.json({ error: "Could not send your inquiry. Please try again." }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}

async function sendInquiryEmail(lead: Lead) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.DEMO_EMAIL_FROM;
  const projectLine = lead.projectTypes.length ? lead.projectTypes.join(", ") : "Not specified";

  // Prefer the verified transactional email path when both providers exist.
  if (resendKey && from) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from,
        to: process.env.ALERT_EMAIL || "tracyholbrook532@gmail.com",
        reply_to: lead.email,
        subject: "New Trayfolio website inquiry",
        text: [
          `Name: ${lead.name}`, `Email: ${lead.email}`, `Phone: ${lead.phone || "Not given"}`,
          `Business: ${lead.business || "Not given"}`,
          `Project: ${projectLine}`, `SMS consent: ${lead.smsConsent ? "Yes" : "No"}`, "", lead.message,
        ].join("\n"),
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.id) throw new Error("Email provider rejected the submission.");
    return true;
  }
  if (!accessKey) return false;
  const response = await fetch(WEB3FORMS_URL, {
    method: "POST",
    signal: AbortSignal.timeout(10_000),
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `New website inquiry: ${lead.business || lead.name}`,
      from_name: "Trayfolio website",
      replyto: lead.email,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "Not given",
      business: lead.business || "Not given",
      project_type: projectLine,
      sms_consent: lead.smsConsent ? "Yes" : "No",
      message: lead.message,
    }),
  });
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error("Web3Forms rejected the submission.");
  return true;
}
