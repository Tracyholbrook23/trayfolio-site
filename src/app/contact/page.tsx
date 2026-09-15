import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import InquiryForm from "@/components/InquiryForm";
import { EditableField } from "@/components/cms/EditableField";
import { getSectionContent, getSectionDraftCount } from "@/lib/cms/get-content";
import { getSession } from "@/lib/auth/session";
import { draftMode } from "next/headers";
import { VisualEditorToolbar } from "@/components/cms/VisualEditorToolbar";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact | Trayfolio",
  description:
    "Start a website project with Trayfolio. Tell me about your business and get a reply within one business day.",
};

export default async function ContactPage() {
  const [content, session, draft, draftCount] = await Promise.all([getSectionContent("contact"), getSession(), draftMode(), getSectionDraftCount("contact")]);
  const editing = Boolean(session.userId && draft.isEnabled);
  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-900">
      {session.userId ? <VisualEditorToolbar role={session.role} previewing={draft.isEnabled} draftCount={draftCount} /> : null}
      <SiteHeader />
      <main id="main-content" className="flex-1 pb-[var(--stack-overlap)]">
        <section className="mx-auto max-w-5xl px-6 py-24 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <EditableField as="div" sectionKey="contact" fieldKey="eyebrow" label="Page eyebrow" editing={editing} className="text-sm font-semibold uppercase tracking-wider text-stone-500">{content.eyebrow}</EditableField>
              <EditableField as="p" sectionKey="contact" fieldKey="heading" label="Page heading" editing={editing} className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{content.heading}</EditableField>
              <EditableField as="p" sectionKey="contact" fieldKey="intro" label="Introduction" editing={editing} className="mt-4 max-w-sm text-stone-600">{content.intro}</EditableField>
              <div className="mt-8 space-y-3 text-sm text-stone-600">
                <p>
                  <span className="font-semibold text-stone-900">Email: </span>
                  <a
                    href={`mailto:${content.email}`}
                    className="underline decoration-stone-300 underline-offset-4 hover:text-stone-900"
                  >
                    <EditableField as="span" sectionKey="contact" fieldKey="email" label="Contact email" editing={editing}>{content.email}</EditableField>
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-stone-900">Response time: </span>
                  <EditableField as="span" sectionKey="contact" fieldKey="responseTime" label="Response time" editing={editing}>{content.responseTime}</EditableField>
                </p>
              </div>
            </Reveal>
            <Reveal delay={150} className="lg:col-span-3">
              <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6 sm:p-10">
                <InquiryForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
