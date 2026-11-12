import { DEMO_FIELDS, type DemoAnswers } from "@/lib/demo-intake";
import { BUSINESS_ADDRESS, SITE_URL, escapeHtml, type EmailMessage } from "@/lib/email";

/** The parts of a saved demo form the emails need. */
export type DemoLead = {
  token: string;
  email: string;
  name: string | null;
  business: string | null;
  answers: unknown;
  step: string;
  remindersSent: number;
};

/* *************************
 * reminderEmail
 * Builds the "finish your demo order" email for one visitor. It reads like
 * a personal note from Tracy, not a marketing blast, and the second one
 * says plainly that it's the last.
 *
 * @param lead : the saved, unpaid demo form
 * @exception none
 * @return the email to send
 **************************/
export function reminderEmail(lead: DemoLead): EmailMessage {
  const first = (lead.name ?? "").trim().split(/\s+/)[0];
  const hi = first ? `Hi ${first},` : "Hi,";
  const business = (lead.business ?? "").trim();
  const forBusiness = business ? ` for ${business}` : "";
  const finishUrl = `${SITE_URL}/demo?resume=${lead.token}`;
  const stopUrl = `${SITE_URL}/start/unsubscribe?token=${lead.token}`;
  const last = lead.remindersSent >= 1;

  const subject = last
    ? `Still want a website demo${forBusiness}?`
    : `Your Trayfolio demo${forBusiness} is saved`;

  const intro = last
    ? `Just checking in one more time about the website demo you started${forBusiness}. Your answers are still saved if you want to pick it back up.`
    : `You started ordering a custom website demo${forBusiness} but didn't quite get to the end. No problem, I saved your answers, so finishing takes about a minute.`;

  const points = [
    "A custom one-page website demo designed around your business",
    "A live link you can open on your phone and share",
    "Delivered within 48 hours of your order",
    "The $50 comes off the price if you go on to get a full site",
  ];

  const closing = last
    ? "This is the last reminder I'll send. If now isn't the right time, no worries at all."
    : "Have a question before you order? Just reply to this email. It comes straight to me.";

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;max-width:520px;color:#2a2118;line-height:1.6">
      <p style="margin:0 0 16px">${escapeHtml(hi)}</p>
      <p style="margin:0 0 16px">${escapeHtml(intro)}</p>
      <p style="margin:0 0 20px"><a href="${finishUrl}" style="display:inline-block;background:#b5541f;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px">Finish my demo order</a></p>
      <p style="margin:0 0 8px">What you get for $50:</p>
      <ul style="margin:0 0 16px;padding-left:20px">${points.map((point) => `<li style="margin:0 0 4px">${point}</li>`).join("")}</ul>
      <p style="margin:0 0 16px">${escapeHtml(closing)}</p>
      <p style="margin:0 0 24px">Tracy<br>Trayfolio</p>
      <p style="margin:0;font-size:12px;color:#8a7f70">You're getting this because you started a demo order on trayfolio.net. <a href="${stopUrl}" style="color:#8a7f70">Stop these reminders</a>.<br>${escapeHtml(BUSINESS_ADDRESS)}</p>
    </div>`;

  const text = [
    hi,
    "",
    intro,
    "",
    `Finish your order: ${finishUrl}`,
    "",
    "What you get for $50:",
    ...points.map((point) => `- ${point}`),
    "",
    closing,
    "",
    "Tracy",
    "Trayfolio",
    "",
    `You're getting this because you started a demo order on trayfolio.net. Stop these reminders: ${stopUrl}`,
    BUSINESS_ADDRESS,
  ].join("\n");

  return {
    to: lead.email,
    subject,
    html,
    text,
    headers: {
      // Lets Gmail and Apple Mail show their own one-tap unsubscribe button.
      "List-Unsubscribe": `<${SITE_URL}/api/demo-lead/unsubscribe?token=${lead.token}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}

/* *************************
 * ownerSummary
 * Builds Tracy's daily note listing who got a reminder and what they had
 * answered, so she can follow up personally with the promising ones.
 *
 * @param to : Tracy's alert address
 * @param leads : the visitors reminded in this run
 * @exception none
 * @return the email to send
 **************************/
export function ownerSummary(to: string, leads: DemoLead[]): EmailMessage {
  const blocks = leads.map((lead) => {
    const answers = (lead.answers ?? {}) as Partial<DemoAnswers>;
    const lines = DEMO_FIELDS.filter((field) => answers[field.key]).map((field) => `${field.label}: ${answers[field.key]}`);
    const stoppedAt = DEMO_FIELDS.find((field) => field.key === lead.step)?.label ?? (lead.step === "review" ? "Review screen" : lead.step === "checkout" ? "Payment" : lead.step);
    const header = `${lead.name || "No name"} <${lead.email}> (reminder ${lead.remindersSent + 1} of 2, stopped at: ${stoppedAt})`;
    return { header, lines, email: lead.email };
  });

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;max-width:560px;color:#2a2118;line-height:1.6">
      <p style="margin:0 0 16px">${leads.length === 1 ? "1 person" : `${leads.length} people`} started a demo order but didn't pay. ${leads.length === 1 ? "They" : "Each one"} just got a reminder. Click an email to reach out personally.</p>
      ${blocks
        .map(
          (block) => `
        <div style="margin:0 0 18px;padding:14px 16px;border:1px solid #e7ded0;border-radius:12px">
          <p style="margin:0 0 6px;font-weight:600"><a href="mailto:${escapeHtml(block.email)}" style="color:#b5541f">${escapeHtml(block.header)}</a></p>
          <p style="margin:0;font-size:14px">${block.lines.map(escapeHtml).join("<br>")}</p>
        </div>`,
        )
        .join("")}
    </div>`;

  const text = [
    `${leads.length === 1 ? "1 person" : `${leads.length} people`} started a demo order but didn't pay. ${leads.length === 1 ? "They" : "Each one"} just got a reminder.`,
    "",
    ...blocks.flatMap((block) => [block.header, ...block.lines, ""]),
  ].join("\n");

  return { to, subject: `Unfinished demo orders: ${leads.length}`, html, text };
}
