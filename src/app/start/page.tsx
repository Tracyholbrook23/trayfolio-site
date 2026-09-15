import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProjectBuilder from "@/components/ProjectBuilder";
import { EditableField } from "@/components/cms/EditableField";
import { getSectionContent, getSectionDraftCount } from "@/lib/cms/get-content";
import { getSession } from "@/lib/auth/session";
import { draftMode } from "next/headers";
import { VisualEditorToolbar } from "@/components/cms/VisualEditorToolbar";

export const metadata: Metadata = {
  alternates: { canonical: "/start" },
  title: "Start your project | Trayfolio",
  description:
    "Pick a package, add what you need, and pay a 50% deposit to get started. Balance due at launch.",
};

export default async function StartPage() {
  const [content, session, draft, draftCount] = await Promise.all([getSectionContent("start"), getSession(), draftMode(), getSectionDraftCount("start")]);
  const editing = Boolean(session.userId && draft.isEnabled);
  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-900">
      {session.userId ? <VisualEditorToolbar role={session.role} previewing={draft.isEnabled} draftCount={draftCount} /> : null}
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-[var(--stack-overlap)]">
        <section className="mx-auto max-w-6xl px-6 pb-10 pt-16 sm:pt-20">
          <EditableField as="p" sectionKey="start" fieldKey="eyebrow" label="Page eyebrow" editing={editing} className="text-sm font-semibold uppercase tracking-wider text-stone-500">{content.eyebrow}</EditableField>
          <EditableField as="div" sectionKey="start" fieldKey="heading" label="Page heading" editing={editing} className="font-display mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">{content.heading}</EditableField>
          <EditableField as="p" sectionKey="start" fieldKey="intro" label="Introduction" editing={editing} className="mt-5 max-w-xl text-lg leading-8 text-stone-600">{content.intro}</EditableField>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <Suspense fallback={<p className="text-stone-500">Loading the builder...</p>}>
            <ProjectBuilder />
          </Suspense>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
