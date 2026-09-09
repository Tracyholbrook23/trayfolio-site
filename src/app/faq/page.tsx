import type { Metadata } from "next";
import { PACKAGES, formatUSD } from "@/lib/pricing";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: "FAQ | Trayfolio",
  description:
    "Answers to common questions about working with Trayfolio: timelines, payment, ownership, revisions, and support after launch.",
};

const faqGroups = [
  {
    heading: "Getting started",
    faqs: [
      {
        question: "How long does a project take?",
        answer:
          "Most Starter and Growth sites are live in 1-2 weeks. Signature projects typically take 3-5 weeks depending on scope.",
      },
      {
        question: "Can you redesign a site I already have?",
        answer:
          "Yes. Redesigns are one of the three things I do. If your current site is outdated, slow, or doesn't work well on phones, I can rebuild it with a modern look and faster load times.",
      },
      {
        question: "What if I need something not listed here?",
        answer:
          "Every business is different. Email me what you're looking for and I'll put together a custom quote.",
      },
    ],
  },
  {
    heading: "Pricing & payment",
    faqs: [
      {
        question: "How much does a website cost?",
        answer:
          `Builds are flat-rate: ${formatUSD(PACKAGES.starter.amount)} for Starter, ${formatUSD(PACKAGES.growth.amount)} for Growth, and ${formatUSD(PACKAGES.signature.amount)} for Signature. Each package lists exactly what's included on the pricing page, and add-ons are priced separately.`,
      },
      {
        question: "How does payment work?",
        answer:
          "Half up front to start the project, half due at launch. Build add-ons are one-time charges included in your project total. Optional care plans are billed monthly once your site is live.",
      },
      {
        question: "How many rounds of revisions do I get?",
        answer:
          "Growth includes one round of revisions after launch and Signature includes two. Starter projects are quoted per change if you want edits later, or you can pick up a Care plan for ongoing tweaks.",
      },
    ],
  },
  {
    heading: "After launch",
    faqs: [
      {
        question: "Do I own my website?",
        answer:
          "Yes. The site, its content, and your domain are yours. There's no long-term contract to keep your site online.",
      },
      {
        question: "What happens after my site goes live?",
        answer:
          "Nothing you have to do. Care plans are optional and start at $25/mo for hosting, updates, monitoring, and a bit of edit time each month. They're billed month to month and you can cancel anytime.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-900">
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-[var(--stack-overlap)]">
        {/* Header */}
        <section className="mx-auto max-w-3xl px-6 pb-12 pt-16 text-center sm:pt-24">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">
              FAQ
            </p>
            <h1 className="font-display mx-auto max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Questions, answered.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-stone-600">
              The things people ask me most before we start. If yours isn&apos;t here,
              just email me and I&apos;ll answer it straight.
            </p>
          </Reveal>
        </section>

        {/* Question groups */}
        <section className="mx-auto max-w-3xl px-6 pb-8">
          <div className="space-y-14">
            {faqGroups.map((group, groupIndex) => (
              <Reveal key={group.heading} delay={groupIndex * 100}>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                  {group.heading}
                </h2>
                <dl className="mt-6 divide-y divide-stone-200 border-t border-stone-200">
                  {group.faqs.map((faq) => (
                    <div key={faq.question} className="py-6">
                      <dt className="font-display text-lg font-semibold tracking-tight">
                        {faq.question}
                      </dt>
                      <dd className="mt-2 leading-7 text-stone-600">{faq.answer}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mx-auto max-w-3xl px-6 py-20">
          <Reveal>
            <div className="rounded-3xl bg-peach px-8 py-14 text-center text-stone-900 sm:px-16">
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Still have a question?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-stone-600">
                Ask me directly. I read every message myself and usually reply within a
                business day.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-light"
                >
                  Get in touch
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-white"
                >
                  See pricing
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
