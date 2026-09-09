import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  alternates: { canonical: "/start/canceled" },
  title: "Checkout canceled | Trayfolio",
  description: "No payment was taken.",
  robots: { index: false },
};

export default function CheckoutCanceled() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-900">
      <SiteHeader />
      <main id="main-content" className="flex-1 pb-[var(--stack-overlap)]">
        <section className="mx-auto max-w-2xl px-6 py-24 text-center sm:py-32">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            No payment was taken.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-stone-600">
            Your selections are still there if you want to pick up where you left off. If
            something was unclear or the price wasn&apos;t right, tell me and we&apos;ll
            work it out.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/start" className="rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-light">
              Back to the builder
            </Link>
            <Link href="/contact" className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50">
              Ask me a question
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
