import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { EditableField } from "@/components/cms/EditableField";
import { getSectionContent, getSectionDraftCount } from "@/lib/cms/get-content";
import { getSession } from "@/lib/auth/session";
import { PACKAGES, formatUSD } from "@/lib/pricing";
import { draftMode } from "next/headers";
import { VisualEditorToolbar } from "@/components/cms/VisualEditorToolbar";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: "FAQ | Trayfolio",
  description:
    "Answers to common questions about working with Trayfolio: timelines, payment, ownership, revisions, and support after launch.",
};

export default async function FaqPage() {
  const [content, session, draft, draftCount] = await Promise.all([getSectionContent("faq"), getSession(), draftMode(), getSectionDraftCount("faq")]);
  const editing = Boolean(session.userId && draft.isEnabled);
  const costAnswer = `Builds are flat-rate: ${formatUSD(PACKAGES.starter.amount)} for Starter, ${formatUSD(PACKAGES.growth.amount)} for Growth, and ${formatUSD(PACKAGES.signature.amount)} for Signature. Each package lists exactly what's included on the pricing page, and add-ons are priced separately.`;
  const faqGroups = [
    { headingKey: "gettingStartedHeading", faqs: [{ questionKey: "timelineQuestion", answerKey: "timelineAnswer" }, { questionKey: "redesignQuestion", answerKey: "redesignAnswer" }, { questionKey: "customQuestion", answerKey: "customAnswer" }] },
    { headingKey: "pricingHeading", faqs: [{ questionKey: "costQuestion", answer: costAnswer }, { questionKey: "paymentQuestion", answerKey: "paymentAnswer" }, { questionKey: "revisionsQuestion", answerKey: "revisionsAnswer" }] },
    { headingKey: "afterLaunchHeading", faqs: [{ questionKey: "ownershipQuestion", answerKey: "ownershipAnswer" }, { questionKey: "launchQuestion", answerKey: "launchAnswer" }] },
  ];
  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-900">
      {session.userId ? <VisualEditorToolbar role={session.role} previewing={draft.isEnabled} draftCount={draftCount} /> : null}
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-[var(--stack-overlap)]">
        {/* Header */}
        <section className="mx-auto max-w-3xl px-6 pb-12 pt-16 text-center sm:pt-24">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">
              FAQ
            </p>
            <EditableField as="div" sectionKey="faq" fieldKey="heading" label="Page heading" editing={editing} className="font-display mx-auto max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{content.heading}</EditableField>
            <EditableField as="p" sectionKey="faq" fieldKey="intro" label="Page introduction" editing={editing} className="mx-auto mt-6 max-w-xl text-lg leading-8 text-stone-600">{content.intro}</EditableField>
          </Reveal>
        </section>

        {/* Question groups */}
        <section className="mx-auto max-w-3xl px-6 pb-8">
          <div className="space-y-14">
            {faqGroups.map((group, groupIndex) => (
              <Reveal key={group.headingKey} delay={groupIndex * 100}>
                <EditableField as="div" sectionKey="faq" fieldKey={group.headingKey} label="FAQ group heading" editing={editing} className="text-sm font-semibold uppercase tracking-wider text-stone-500">{content[group.headingKey]}</EditableField>
                <dl className="mt-6 divide-y divide-stone-200 border-t border-stone-200">
                  {group.faqs.map((faq) => (
                    <div key={faq.questionKey} className="py-6">
                      <dt><EditableField as="div" sectionKey="faq" fieldKey={faq.questionKey} label="FAQ question" editing={editing} className="font-display text-lg font-semibold tracking-tight">{content[faq.questionKey]}</EditableField></dt>
                      <dd>{faq.answerKey ? <EditableField as="div" sectionKey="faq" fieldKey={faq.answerKey} label="FAQ answer" editing={editing} className="mt-2 leading-7 text-stone-600">{content[faq.answerKey]}</EditableField> : <div className="mt-2 leading-7 text-stone-600">{faq.answer}</div>}</dd>
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
              <EditableField as="div" sectionKey="faq" fieldKey="ctaHeading" label="Callout heading" editing={editing} className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{content.ctaHeading}</EditableField>
              <EditableField as="p" sectionKey="faq" fieldKey="ctaBody" label="Callout text" editing={editing} className="mx-auto mt-3 max-w-md text-stone-600">{content.ctaBody}</EditableField>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-light"
                >
                  <EditableField as="span" sectionKey="faq" fieldKey="contactCta" label="Contact button" editing={editing}>{content.contactCta}</EditableField>
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-white"
                >
                  <EditableField as="span" sectionKey="faq" fieldKey="pricingCta" label="Pricing button" editing={editing}>{content.pricingCta}</EditableField>
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
