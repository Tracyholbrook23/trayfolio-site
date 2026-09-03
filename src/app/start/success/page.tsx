import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Deposit received | Trayfolio",
  description: "Your deposit went through and your project is booked.",
  robots: { index: false },
};

export default function CheckoutSuccess() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-900">
      <SiteHeader />
      <main className="flex-1 pb-[var(--stack-overlap)]">
        <section className="mx-auto max-w-2xl px-6 py-24 text-center sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">
            Deposit received
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            You&apos;re booked in.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-stone-600">
            Stripe just emailed you a receipt. I&apos;ll follow up within one business day
            to collect your content and get started.
          </p>
          <div className="mx-auto mt-10 max-w-md border border-stone-200 p-6 text-left">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
              What happens next
            </h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
              <li><span className="font-semibold text-terracotta">1.</span> I email you to ask about your business, your photos, and what you want the site to do.</li>
              <li><span className="font-semibold text-terracotta">2.</span> I build the first version and send you a link.</li>
              <li><span className="font-semibold text-terracotta">3.</span> We adjust it until it&apos;s right.</li>
              <li><span className="font-semibold text-terracotta">4.</span> You pay the balance and it goes live on your domain.</li>
            </ol>
          </div>
          <p className="mt-8 text-sm text-stone-500">
            Something look wrong? Email{" "}
            <a href="mailto:tracyholbrook532@gmail.com" className="underline underline-offset-4 hover:text-stone-900">
              tracyholbrook532@gmail.com
            </a>
          </p>
          <Link href="/" className="mt-10 inline-block rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800">
            Back to Trayfolio
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
