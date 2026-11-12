/**
 * Small Resend helpers for emails sent outside the Stripe webhook (which
 * keeps its own copy so a change here can never break order emails).
 */

export const SITE_URL = "https://www.trayfolio.net";
export const BUSINESS_ADDRESS = "Trayfolio · 7711 O'Connor Dr, Round Rock, TX 78681";

/** Visitor-typed text goes into HTML emails, so it must not be able to inject markup. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

/* *************************
 * emailConfigured
 * Whether Resend is set up well enough to send anything.
 *
 * @param none
 * @exception none
 * @return true when the API key and from address are both set
 **************************/
export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.DEMO_EMAIL_FROM);
}

/* *************************
 * sendEmail
 * Sends one email through Resend. Replies go to Tracy unless the message
 * says otherwise, since the sending domain has no mailbox.
 *
 * @param message : recipient, subject, html and text bodies, optional reply-to and headers
 * @exception none (failures are returned, not thrown)
 * @return whether Resend accepted the message
 **************************/
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.DEMO_EMAIL_FROM;
  if (!apiKey || !from) return false;
  const replyTo = message.replyTo ?? process.env.REPLY_TO_EMAIL ?? process.env.ALERT_EMAIL;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        ...(replyTo ? { reply_to: replyTo } : {}),
        ...(message.headers ? { headers: message.headers } : {}),
      }),
    });
    if (!response.ok) {
      console.error(`Resend rejected email to ${message.to}: ${response.status} ${await response.text()}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Email to ${message.to} failed`, error);
    return false;
  }
}
