import crypto from "node:crypto";
import { DEMO_COUPON_NAME } from "@/lib/pricing";
import { STRIPE_API_VERSION, stripeHeaders } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Stripe tells us a payment happened by POSTing here.
 *
 * SECURITY: anyone can POST to this URL, so nothing in the body is believed
 * until the signature checks out against STRIPE_WEBHOOK_SECRET. Without that
 * check, a stranger could fake a "payment succeeded" event and get a free
 * demo credit. We also reject anything older than five minutes so a captured
 * request can't be replayed later.
 */

const TOLERANCE_SECONDS = 300;

function verify(payload: string, header: string | null, secret: string): boolean {
  if (!header) return false;

  let timestamp = "";
  const signatures: string[] = [];
  for (const part of header.split(",")) {
    const [key, value] = part.split("=");
    if (key === "t") timestamp = value;
    if (key === "v1" && value) signatures.push(value);
  }
  if (!timestamp || signatures.length === 0) return false;

  const age = Math.floor(Date.now() / 1000) - Number(timestamp);
  if (!Number.isFinite(age) || Math.abs(age) > TOLERANCE_SECONDS) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");

  return signatures.some((candidate) => {
    const candidateBuffer = Buffer.from(candidate, "utf8");
    return (
      candidateBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(candidateBuffer, expectedBuffer)
    );
  });
}

/** Finds the "Demo credit" coupon so we never hardcode an id that differs
 *  between test mode and live mode. */
async function findDemoCoupon(secretKey: string): Promise<string | null> {
  const response = await fetch("https://api.stripe.com/v1/coupons?limit=100", {
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Stripe-Version": STRIPE_API_VERSION,
    },
  });
  if (!response.ok) return null;
  const body = await response.json();
  const match = (body.data ?? []).find(
    (coupon: { name?: string; valid?: boolean }) =>
      coupon.name === DEMO_COUPON_NAME && coupon.valid !== false
  );
  return match?.id ?? null;
}

/** A one-time code, unique per buyer, so a leaked code costs at most $50. */
async function createCreditCode(secretKey: string, couponId: string): Promise<string | null> {
  const code = `DEMO-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const form = new URLSearchParams();
  // As of 2026-05-27.dahlia the coupon is nested under `promotion`, not a
  // flat `coupon` param. Verified against the live API, not assumed.
  form.set("promotion[type]", "coupon");
  form.set("promotion[coupon]", couponId);
  form.set("code", code);
  form.set("max_redemptions", "1");
  // Ninety days is long enough to decide, short enough that it can't come
  // back a year later.
  form.set("expires_at", String(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90));

  const response = await fetch("https://api.stripe.com/v1/promotion_codes", {
    method: "POST",
    headers: stripeHeaders(secretKey),
    body: form.toString(),
  });
  if (!response.ok) {
    console.error("Promotion code creation failed", await response.text());
    return null;
  }
  return code;
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";

type SendResult = { ok: true } | { ok: false; detail: string };

async function sendViaResend(
  apiKey: string,
  message: { from: string; to: string; subject: string; html: string }
): Promise<SendResult> {
  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    if (response.ok) return { ok: true };
    return { ok: false, detail: `${response.status} ${await response.text()}` };
  } catch (error) {
    return { ok: false, detail: String(error) };
  }
}

/** If the buyer's email fails, tell Tracy, because otherwise a paying
 *  customer just gets silence and nobody finds out for weeks. Needs
 *  ALERT_EMAIL set; without it this is a no-op and the console is the
 *  only record. */
async function alertOwner(
  apiKey: string,
  from: string,
  customer: string,
  code: string,
  detail: string
): Promise<void> {
  const alertTo = process.env.ALERT_EMAIL;
  if (!alertTo) return;

  const result = await sendViaResend(apiKey, {
    from,
    to: alertTo,
    subject: `Action needed: demo credit ${code} did not reach ${customer}`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.6">
        <p><strong>${customer}</strong> paid for a demo, but the credit email did not send.</p>
        <p>Their code is <strong>${code}</strong> — it exists in Stripe and is valid. Send it to them by hand.</p>
        <p style="color:#6b6154;font-size:13px">Resend said: ${detail}</p>
      </div>`,
  });

  if (!result.ok) {
    console.error(`Alert email also failed: ${result.detail}`);
  }
}

async function emailCredit(to: string, code: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.DEMO_EMAIL_FROM;
  if (!apiKey || !from) {
    console.error(
      "Credit email skipped: RESEND_API_KEY or DEMO_EMAIL_FROM is not set"
    );
    return false;
  }

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;max-width:520px;color:#2a2118;line-height:1.6">
      <p style="font-size:18px;font-weight:600;margin:0 0 16px">Thanks for ordering a demo.</p>
      <p style="margin:0 0 16px">I'll be in touch within 24 hours to ask about your business and get started on it.</p>
      <p style="margin:0 0 8px">Here's your $50 credit code. It comes straight off the price if you decide to buy a site:</p>
      <p style="font-size:24px;font-weight:700;letter-spacing:2px;background:#fbead9;padding:14px 18px;margin:0 0 16px;display:inline-block">${code}</p>
      <p style="margin:0 0 16px;font-size:14px;color:#6b6154">Enter it at checkout on trayfolio.net. It works once and is good for 90 days.</p>
      <p style="margin:0">Tracy<br><span style="color:#6b6154">Trayfolio</span></p>
    </div>`;

  const message = {
    from,
    to,
    subject: "Your Trayfolio demo, and your $50 credit code",
    html,
  };

  // Two attempts: a failure here is usually a transient blip rather than a
  // bad config, and the customer has already paid.
  let detail = "unknown error";
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const result = await sendViaResend(apiKey, message);
    if (result.ok) return true;
    detail = result.detail;
    if (attempt === 1) {
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }

  console.error(`Credit email to ${to} failed after 2 attempts: ${detail}`);
  await alertOwner(apiKey, from, to, code, detail);
  return false;
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return new Response("Not configured", { status: 503 });
  }

  // Must read the raw body: any reserialization changes the bytes and the
  // signature stops matching.
  const payload = await request.text();

  if (!verify(payload, request.headers.get("stripe-signature"), webhookSecret)) {
    return new Response("Invalid signature", { status: 400 });
  }

  let event: { type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(payload);
  } catch {
    return new Response("Bad payload", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response("Ignored", { status: 200 });
  }

  const session = event.data?.object ?? {};
  const metadata = (session.metadata ?? {}) as Record<string, string>;
  if (metadata.kind !== "demo") {
    return new Response("Ignored", { status: 200 });
  }

  const details = session.customer_details as { email?: string } | undefined;
  const email = details?.email;
  if (!email) {
    console.error("Demo purchase had no email on the session");
    return new Response("OK", { status: 200 });
  }

  try {
    const couponId = await findDemoCoupon(secretKey);
    if (!couponId) {
      console.error(`Could not find a Stripe coupon named "${DEMO_COUPON_NAME}"`);
      return new Response("OK", { status: 200 });
    }

    const code = await createCreditCode(secretKey, couponId);
    if (!code) {
      console.error("Could not create a demo credit code");
      return new Response("OK", { status: 200 });
    }

    const sent = await emailCredit(email, code);
    if (!sent) {
      // Not fatal: the code exists in Stripe and can be sent by hand.
      console.error(`Demo credit ${code} created for ${email} but the email did not send`);
    }
  } catch (error) {
    console.error("Demo fulfillment failed", error);
  }

  // Always 200 once the signature is valid, so Stripe does not retry forever.
  return new Response("OK", { status: 200 });
}
