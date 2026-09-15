"use client";

import { useRouter } from "next/navigation";
import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type EditableTag = "div" | "span" | "p";

/**
 * Wraps one piece of the public site that's backed by a CMS field. When
 * `editing` is true, clicking (or pressing Enter/Space on) the wrapped
 * content jumps straight to that field's editor, so a logged-in client
 * can find what to change by clicking the actual text on their site
 * instead of hunting through the dashboard's section list for it.
 *
 * `editing` is decided by the SERVER page that renders this (a session
 * check, see the getSession() call in page.tsx), never decided here: this
 * component is a client-side UX convenience layered on top of a click, it
 * grants no access on its own. Every write this leads to still goes
 * through saveDraftAction / publishSectionAction, each of which
 * re-checks the session independently before touching anything, same as
 * the rest of the dashboard.
 *
 * Renders children completely unwrapped when `editing` is false, the
 * common case, every public visitor, so this never changes markup,
 * spacing, or anything else for anyone but a logged-in client looking at
 * their own site.
 */
export function EditableField({
  sectionKey,
  fieldKey,
  label,
  editing,
  as: Tag = "div",
  className,
  children,
}: {
  sectionKey: string;
  fieldKey: string;
  label: string;
  editing: boolean;
  as?: EditableTag;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  if (!editing) {
    const Plain = Tag;
    return <Plain className={className}>{children}</Plain>;
  }

  const goToEditor = () => router.push(`/client/dashboard/${sectionKey}#field-${fieldKey}`);

  return (
    <Tag
      className={cn(
        className,
        "group relative cursor-pointer rounded-md outline-none transition hover:ring-2 hover:ring-terracotta/60 hover:ring-offset-2 focus-visible:ring-2 focus-visible:ring-terracotta",
      )}
      role="link"
      tabIndex={0}
      aria-label={`Edit "${label}"`}
      onClick={goToEditor}
      onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToEditor();
        }
      }}
    >
      {children}
      <span className="pointer-events-none absolute -right-2 -top-2 hidden rounded-full bg-terracotta px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm group-hover:block group-focus-visible:block">
        Edit
      </span>
    </Tag>
  );
}
