import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contentSchema } from "@/lib/cms/content.schema";
import { getEditableValue } from "@/lib/cms/get-content";
import { SectionEditorForm } from "./section-editor-form";
import { PublishSectionButton } from "./publish-section-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section: sectionKey } = await params;
  const section = contentSchema.find((s) => s.key === sectionKey);
  return { title: section ? `${section.label} | Dashboard` : "Dashboard" };
}

/**
 * Generic per-section editor: one form per FieldDef, prefilled with the
 * field's current draft (if any) or its last published value. Renders
 * purely from content.schema.ts, adding a field to a section here never
 * needs a matching change to this page.
 *
 * proxy.ts already keeps a logged-out visitor off everything under
 * /client/dashboard, this page doesn't re-check the session itself. The
 * Server Action this form submits to (saveDraftAction) does re-check,
 * independently, before writing anything, since that's the point where a
 * missed check would actually matter.
 */
export default async function SectionEditorPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: sectionKey } = await params;
  const section = contentSchema.find((s) => s.key === sectionKey);
  if (!section) notFound();

  const fields = await Promise.all(
    section.fields.map(async (field) => ({
      field,
      ...(await getEditableValue(section.key, field.key)),
    })),
  );

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-16">
      <div className="mx-auto max-w-lg">
        <a href="/client/dashboard" className="text-sm text-stone-500 underline">
          &larr; All sections
        </a>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-stone-900">{section.label}</h1>
          <PublishSectionButton sectionKey={section.key} />
        </div>

        <div className="mt-8 space-y-8">
          {fields.map(({ field, value, isDraft }) => (
            <SectionEditorForm
              key={field.key}
              sectionKey={section.key}
              field={field}
              initialValue={value ?? ""}
              isDraft={isDraft}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
