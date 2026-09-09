import { readSubmission } from "@/lib/submission";
import { NextResponse } from "next/server";
import {
  buildQuote,
  formatUSD,
  DEMO,
  type AddOnId,
  type PackageId,
  PACKAGES,
  ADD_ONS,
} from "@/lib/pricing";
import { stripeHeaders } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Creates a Stripe Checkout Session for the deposit on a project.
 *
 * The secret key is read here and only here. This file runs on the server,
 * never in the browser, and the key is deliberately NOT named with the
 * NEXT_PUBLIC_ prefix, which is the only way a value reaches client code in
 * Next.js. Card details never touch this site: Stripe hosts the payment page.
 */

const STRIPE_API = "https://api.stripe.com/v1/checkout/sessions";

// Crude per-instance rate limit. Serverless means this is per warm instance
// rather than global, so it will not stop a determined attacker, but it does
// stop the casual card-testing scripts that hammer a single endpoint.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function isPackageId(value: unknown): value is PackageId {
  return typeof value === "string" && Object.hasOwn(PACKAGES, value);
}

function isAddOnId(value: unknown): value is AddOnId {
  return typeof value === "string" && Object.hasOwn(ADD_ONS, value);
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    // Never echo anything about the key itself.
    return NextResponse.json(
      { error: "Checkout is not configured yet. Please email me instead." },
      { status: 503 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Give it a minute and try again." },
      { status: 429 }
    );
  }

  const submission = await readSubmission(request);
  if (!submission.ok) return submission.response;
  const payload = submission.data;

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const body = payload as { kind?: unknown; packageId?: unknown; addOns?: unknown };
  if (body.kind !== undefined && body.kind !== "demo") {
    return NextResponse.json({ error: "Invalid checkout type." }, { status: 400 });
  }
  const origin = new URL(request.url).origin;

  // --- The $50 demo: one fixed item, no configuration, no deposit split. ---
  if (body.kind === "demo") {
    const form = new URLSearchParams();
    form.set("mode", "payment");
    form.set("success_url", `${origin}/start/demo-success`);
    form.set("cancel_url", `${origin}/start/canceled`);
    form.set("billing_address_collection", "auto");
    form.set("line_items[0][quantity]", "1");
    form.set("line_items[0][price_data][currency]", "usd");
    form.set("line_items[0][price_data][unit_amount]", String(DEMO.amount));
    form.set("line_items[0][price_data][product_data][name]", DEMO.label);
    form.set("line_items[0][price_data][product_data][description]", DEMO.description);
    // The webhook reads this to know it should issue a credit code.
    form.set("metadata[kind]", "demo");
    return createSession(secretKey, form);
  }

  if (!isPackageId(body.packageId)) {
    return NextResponse.json({ error: "Pick a package to continue." }, { status: 400 });
  }

  if (body.addOns !== undefined && !Array.isArray(body.addOns)) {
    return NextResponse.json({ error: "Invalid add-ons." }, { status: 400 });
  }
  const rawAddOns = Array.isArray(body.addOns) ? body.addOns : [];
  if (rawAddOns.length > 20) {
    return NextResponse.json({ error: "Too many add-ons." }, { status: 400 });
  }

  const addOns: { id: AddOnId; quantity: number }[] = [];
  for (const entry of rawAddOns) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      return NextResponse.json({ error: "That selection is not valid." }, { status: 400 });
    }
    const item = entry as { id?: unknown; quantity?: unknown };
    if (!isAddOnId(item.id) || typeof item.quantity !== "number" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 40) {
      return NextResponse.json({ error: "That selection is not valid." }, { status: 400 });
    }
    addOns.push({ id: item.id, quantity: item.quantity });
  }

  let quote;
  try {
    // Prices come from the server catalog. Nothing the browser sent is trusted
    // as an amount, so there is no way to talk the total down.
    quote = buildQuote({ packageId: body.packageId, addOns });
  } catch {
    return NextResponse.json({ error: "That selection is not valid." }, { status: 400 });
  }

  const summary = quote.lines
    .map((line) => (line.quantity > 1 ? `${line.label} x${line.quantity}` : line.label))
    .join(", ");

  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("success_url", `${origin}/start/success?session_id={CHECKOUT_SESSION_ID}`);
  form.set("cancel_url", `${origin}/start/canceled`);
  form.set("allow_promotion_codes", "true");
  form.set("billing_address_collection", "auto");
  form.set("phone_number_collection[enabled]", "true");
  form.set("line_items[0][quantity]", "1");
  form.set("line_items[0][price_data][currency]", "usd");
  form.set("line_items[0][price_data][unit_amount]", String(quote.depositDue));
  form.set(
    "line_items[0][price_data][product_data][name]",
    `Website project deposit (50%)`
  );
  form.set(
    "line_items[0][price_data][product_data][description]",
    `${summary}. Project total ${formatUSD(quote.total)}. Balance of ${formatUSD(
      quote.balanceDue
    )} due at launch.`
  );
  // Kept on the session so the full quote is visible in the Stripe dashboard.
  form.set("metadata[project_total]", String(quote.total));
  form.set("metadata[balance_due]", String(quote.balanceDue));
  form.set("metadata[kind]", "project");
  form.set("metadata[summary]", summary.slice(0, 500));

  return createSession(secretKey, form);
}

async function createSession(secretKey: string, form: URLSearchParams) {
  try {
    const response = await fetch(STRIPE_API, {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: stripeHeaders(secretKey),
      body: form.toString(),
    });

    const session = await response.json();

    if (!response.ok || !session?.url) {
      // Log for us, stay vague for the visitor.
      console.error("Stripe checkout session failed", session?.error?.message);
      return NextResponse.json(
        { error: "Could not start checkout. Please email me and I'll sort it out." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the payment provider. Please try again." },
      { status: 502 }
    );
  }
}
