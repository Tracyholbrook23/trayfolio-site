/**
 * The single source of truth for what anything costs.
 *
 * SECURITY: the browser never sends a price. It sends catalog ids, and the
 * server looks the amounts up here. That means a tampered request either
 * names a real item at its real price or gets rejected, and there is no
 * input anywhere that a dollar figure can be injected into.
 *
 * Amounts are in cents, because that is what Stripe expects and because
 * floating point dollars eventually cost someone money.
 */

export type AddOnId =
  | "page"
  | "form"
  | "motion"
  | "payments"
  | "store"
  | "booking"
  | "logo"
  | "copy"
  | "photos"
  | "blog"
  | "email";

export type PackageId = "starter" | "growth" | "signature";

export const DEPOSIT_RATE = 0.5;

/** The paid demo. Credited against a build, never refunded. */
export const DEMO = {
  label: "Trayfolio demo landing page",
  amount: 5000,
  description:
    "One real landing page built for your business, live on a link you can click. The $50 comes off the price if you go on to buy a site. Non-refundable and applied as credit, not a deposit.",
} as const;

/** Name of the Stripe coupon the demo credit codes are generated from. */
export const DEMO_COUPON_NAME = "Demo credit";

export const PACKAGES: Record<
  PackageId,
  { label: string; amount: number; pages: number; includes: AddOnId[]; blurb: string }
> = {
  starter: {
    label: "Starter package",
    amount: 40000,
    pages: 3,
    includes: ["form"],
    blurb: "Up to 3 pages with a contact form.",
  },
  growth: {
    label: "Growth package",
    amount: 60000,
    pages: 6,
    includes: ["form", "motion"],
    blurb: "Up to 6 pages, contact form, and 3D scroll motion.",
  },
  signature: {
    label: "Signature package",
    amount: 100000,
    pages: 10,
    includes: ["form", "motion", "payments", "booking"],
    blurb: "Up to 10 pages with motion, online payments, and booking.",
  },
};

export const ADD_ONS: Record<
  AddOnId,
  { label: string; amount: number; group: string; note: string; perUnit?: boolean }
> = {
  page: { label: "Extra page", amount: 5000, group: "The build", note: "Any page past what the package includes.", perUnit: true },
  form: { label: "Contact form", amount: 5000, group: "The build", note: "Form, spam protection, delivered to your inbox." },
  motion: { label: "3D scroll motion", amount: 7500, group: "The build", note: "Scroll-scrubbed video and layered motion." },
  payments: { label: "Online payments", amount: 15000, group: "Selling and booking", note: "Take card payments on your site." },
  store: { label: "Online store", amount: 30000, group: "Selling and booking", note: "Product pages, cart, and checkout." },
  booking: { label: "Booking and scheduling", amount: 10000, group: "Selling and booking", note: "An appointment calendar on your site." },
  logo: { label: "Logo and brand basics", amount: 15000, group: "Brand and content", note: "Logo, colors, fonts, and a one-page guide." },
  copy: { label: "Copywriting", amount: 4000, group: "Brand and content", note: "I write the page instead of waiting on you.", perUnit: true },
  photos: { label: "Photo sourcing", amount: 5000, group: "Brand and content", note: "Photos picked and prepared for your business." },
  blog: { label: "Blog setup", amount: 10000, group: "Brand and content", note: "A blog section you can post to yourself." },
  email: { label: "Custom email", amount: 5000, group: "Brand and content", note: "name@yourbusiness.com, set up and working." },
};

/** What the browser is allowed to send. Anything else is rejected. */
export type QuoteRequest = {
  packageId: PackageId;
  addOns: { id: AddOnId; quantity: number }[];
};

export type QuoteLine = { label: string; amount: number; quantity: number };

export type Quote = {
  lines: QuoteLine[];
  total: number;
  depositDue: number;
  balanceDue: number;
};

const MAX_QUANTITY = 40;

/**
 * Turns a request into a priced quote, or throws. Used by the checkout API
 * and by the browser for display, so the two can never disagree about what
 * something costs.
 */
export function buildQuote(request: QuoteRequest): Quote {
  const pkg = PACKAGES[request.packageId];
  if (!pkg) throw new Error("Unknown package.");

  const lines: QuoteLine[] = [{ label: pkg.label, amount: pkg.amount, quantity: 1 }];
  const seen = new Set<AddOnId>();

  for (const entry of request.addOns) {
    const addOn = ADD_ONS[entry.id];
    if (!addOn) throw new Error("Unknown add-on.");
    if (seen.has(entry.id)) throw new Error("Duplicate add-on.");
    seen.add(entry.id);

    // Anything the package already covers is never charged again.
    if (pkg.includes.includes(entry.id)) continue;

    const quantity = Math.floor(entry.quantity);
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new Error("Invalid quantity.");
    }
    if (!addOn.perUnit && quantity !== 1) throw new Error("Invalid quantity.");

    lines.push({ label: addOn.label, amount: addOn.amount, quantity });
  }

  const total = lines.reduce((sum, line) => sum + line.amount * line.quantity, 0);
  const depositDue = Math.round(total * DEPOSIT_RATE);

  return { lines, total, depositDue, balanceDue: total - depositDue };
}

export function formatUSD(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
