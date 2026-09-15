export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "url"
  | "price"
  | "number"
  | "select"
  | "image"
  | "list";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  helpText?: string;
}

export interface SectionDef {
  key: string;
  label: string;
  fields: FieldDef[];
}

/**
 * The editable-content contract for trayfolio-site. Once the dashboard
 * exists, it renders itself entirely from this array and has no built-in
 * knowledge of what fields exist on any given site, see
 * /areas/client-cms-system.md and section 5 of the architecture doc.
 *
 * Phase 0 status: one field, just proving the read + cache-invalidation
 * path end to end before any dashboard or auth exists yet.
 */
export const contentSchema: SectionDef[] = [
  {
    key: "home",
    label: "Home Page",
    fields: [
      {
        key: "heroLede",
        label: "Hero Subheading",
        type: "textarea",
        required: true,
        maxLength: 160,
        helpText: "The line under the main headline on the homepage.",
      },
    ],
  },
];
