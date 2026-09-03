/**
 * Stripe request plumbing.
 *
 * The API version is pinned on purpose. Stripe rolls accounts onto new
 * versions over time, and shapes do change: in 2026-05-27.dahlia a promotion
 * code's coupon moved from a flat `coupon` param to a nested `promotion`
 * object. Pinning means Stripe's next change breaks nothing here until we
 * choose to move, rather than breaking checkout on a random Tuesday.
 */
export const STRIPE_API_VERSION = "2026-05-27.dahlia";

export function stripeHeaders(secretKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/x-www-form-urlencoded",
    "Stripe-Version": STRIPE_API_VERSION,
  };
}
