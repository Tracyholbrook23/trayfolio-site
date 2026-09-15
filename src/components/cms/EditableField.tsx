"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { saveInlineDraftAction } from "@/lib/cms/actions";
import { getFieldDef } from "@/lib/cms/content.schema";
import { cn } from "@/lib/utils";

type EditableTag = "div" | "span" | "p";

/** Click-to-edit text on the real website; saves a validated CMS draft. */
export function EditableField({ sectionKey, fieldKey, label, editing, value, as: Tag = "div", className, children }: {
  sectionKey: string;
  fieldKey: string;
  label: string;
  editing: boolean;
  value?: string;
  as?: EditableTag;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const initialValue = value ?? (typeof children === "string" ? children : "");
  const [savedValue, setSavedValue] = useState(initialValue);
  const [draftValue, setDraftValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const field = getFieldDef(sectionKey, fieldKey);

  if (!editing) return <Tag className={className}>{children}</Tag>;

  const openEditor = () => {
    setDraftValue(savedValue);
    setError(undefined);
    setIsEditing(true);
  };
  const cancel = () => {
    setDraftValue(savedValue);
    setError(undefined);
    setIsEditing(false);
  };
  const save = () => {
    const formData = new FormData();
    formData.set("sectionKey", sectionKey);
    formData.set("fieldKey", fieldKey);
    formData.set("value", draftValue);
    startTransition(async () => {
      const result = await saveInlineDraftAction(formData);
      if (result.error) return setError(result.error);
      setSavedValue(draftValue.trim());
      setIsEditing(false);
      router.refresh();
    });
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      openEditor();
    }
  };

  return (
    <>
      <Tag
        className={cn(className, "group relative cursor-text rounded-md outline-none transition", isEditing ? "ring-2 ring-terracotta ring-offset-2" : "hover:ring-2 hover:ring-terracotta/60 hover:ring-offset-2 focus-visible:ring-2 focus-visible:ring-terracotta")}
        role="button"
        tabIndex={0}
        aria-label={`Edit ${label}`}
        onClick={(event) => { event.preventDefault(); event.stopPropagation(); openEditor(); }}
        onKeyDown={handleKeyDown}
      >
        {isEditing ? draftValue : children}
        {!isEditing ? <span className="pointer-events-none absolute -right-2 -top-2 hidden rounded-full bg-terracotta px-2 py-0.5 text-[10px] font-semibold leading-4 text-white shadow-sm group-hover:block group-focus-visible:block">Edit</span> : null}
      </Tag>

      {isEditing && typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-x-4 bottom-4 z-[300] mx-auto max-w-xl rounded-2xl border border-stone-300 bg-white p-4 text-left text-stone-900 shadow-2xl" role="dialog" aria-label={`Editing ${label}`}>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor={`visual-editor-${sectionKey}-${fieldKey}`} className="text-sm font-semibold">{label}</label>
            {field?.maxLength ? <span className="text-xs text-stone-500">{draftValue.length}/{field.maxLength}</span> : null}
          </div>
          <textarea
            id={`visual-editor-${sectionKey}-${fieldKey}`}
            autoFocus
            rows={field?.type === "textarea" ? 4 : 2}
            maxLength={field?.maxLength}
            value={draftValue}
            onChange={(event) => setDraftValue(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Escape") cancel(); if ((event.metaKey || event.ctrlKey) && event.key === "Enter") save(); }}
            className="mt-2 w-full resize-y rounded-lg border border-stone-300 px-3 py-2 text-base leading-6 outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
          />
          {error ? <p role="alert" className="mt-2 text-sm text-red-600">{error}</p> : null}
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-stone-500">Save: ⌘/Ctrl + Enter</span>
            <div className="flex gap-2">
              <button type="button" onClick={cancel} disabled={pending} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium disabled:opacity-50">Cancel</button>
              <button type="button" onClick={save} disabled={pending} className="rounded-lg bg-terracotta px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{pending ? "Saving…" : "Save draft"}</button>
            </div>
          </div>
        </div>, document.body) : null}
    </>
  );
}
