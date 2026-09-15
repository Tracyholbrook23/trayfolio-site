import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contentSchema } from "@/lib/cms/content.schema";
import { getFieldVersions } from "@/lib/cms/get-content";
import { RollbackFieldButton } from "./rollback-field-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; field: string }>;
}): Promise<Metadata> {
  const { section: sectionKey, field: fieldKey } = await params;
  const section = contentSchema.find((s) => s.key === sectionKey);
  const field = section?.fields.find((f) => f.key === fieldKey);
  return { title: field ? `${field.label} history | Dashboard` : "Dashboard" };
}

/**
 * Publish history for one field, most recent first, with a "Roll back to
 * this" button on every version except the current one. Rollback
 * republishes that version's value (see rollbackFieldAction in actions.ts),
 * it never edits history in place, so this list only ever grows.
 *
 * proxy.ts already keeps a logged-out visitor off everything under
 * /client/dashboard, same as the section editor page, this page doesn't
 * re-check the session itself. rollbackFieldAction does, independently,
 * before writing anything.
 */
export default async function FieldHistoryPage({
  params,
}: {
  params: Promise<{ section: string; field: string }>;
}) {
  const { section: sectionKey, field: fieldKey } = await params;
  const section = contentSchema.find((s) => s.key === sectionKey);
  const field = section?.fields.find((f) => f.key === fieldKey);
  if (!section || !field) notFound();

  const versions = await getFieldVersions(sectionKey, fieldKey);

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-16">
      <div className="mx-auto max-w-lg">
        <a href={`/client/dashboard/${sectionKey}`} className="text-sm text-stone-500 underline">
          &larr; {section.label}
        </a>
        <h1 className="mt-2 text-xl font-semibold text-stone-900">{field.label} history</h1>
        <p className="mt-1 text-sm text-stone-600">
          Every version this field has been published with, most recent first.
        </p>

        {versions.length === 0 ? (
          <p className="mt-8 text-sm text-stone-500">Never published yet.</p>
        ) : (
          <ul className="mt-8 space-y-3">
            {versions.map((version, i) => (
              <li key={version.id} className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-medium text-stone-500">
                    {version.publishedAt.toLocaleString()}
                    {version.publishedBy ? ` · ${version.publishedBy}` : ""}
                  </p>
                  {i === 0 ? (
                    <span className="shrink-0 text-xs font-medium text-emerald-700">Current</span>
                  ) : (
                    <div className="shrink-0">
                      <RollbackFieldButton
                        sectionKey={sectionKey}
                        fieldKey={fieldKey}
                        versionId={version.id}
                      />
                    </div>
                  )}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-stone-900">{version.value}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
