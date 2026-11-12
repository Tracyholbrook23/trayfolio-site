import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  alternates: { canonical: "/start/demo-success" },
  title: "Demo ordered | Trayfolio",
  description: "Your demo is ordered and your $50 credit code is on its way.",
  robots: { index: false },
};

export default function DemoSuccess() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-900">
      <SiteHeader />
      <main id="main-content" className="flex-1 pb-[var(--stack-overlap)]">
        <section className="mx-auto max-w-2xl px-6 py-24 text-center sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">
            Demo ordered
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Your demo is officially in motion.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-stone-600">
            Your answers came through with your order, so I&apos;m already getting started.
            Here&apos;s what happens next.
          </p>

          <ol className="mx-auto mt-10 max-w-md space-y-4 text-left">
            {[
              ["Right now", "A confirmation email with your order reference is on its way to you."],
              ["Within 1 business day", "I email you personally to confirm the details. Reply with your logo and a few photos of your work if you have them."],
              ["Within 48 hours", "Your demo link lands in your inbox. If I'm waiting on something from you, I'll let you know and the clock starts once I have it."],
            ].map(([when, what], index) => (
              <li key={when} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-terracotta text-sm font-semibold text-white">{index + 1}</span>
                <div>
                  <p className="font-semibold text-stone-900">{when}</p>
                  <p className="mt-1 leading-7 text-stone-600">{what}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mx-auto mt-10 max-w-md border border-stone-200 bg-peach p-6 text-left">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-600">
              Your $50 credit
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-700">
              A one-time credit code is on its way to the email you just used. It comes
              straight off the price if you go on to buy a site, and it&apos;s good for 90
              days.
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Don&apos;t see it in a few minutes? Check spam, then email me and I&apos;ll
              resend it.
            </p>
          </div>

          <p className="mt-8 text-sm text-stone-500">
            Questions in the meantime?{" "}
            <a
              href="mailto:tracyholbrook532@gmail.com"
              className="underline underline-offset-4 hover:text-stone-900"
            >
              tracyholbrook532@gmail.com
            </a>
          </p>

          <Link
            href="/"
            className="mt-10 inline-block rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Back to Trayfolio
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
