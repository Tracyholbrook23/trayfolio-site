"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import TumbleDeckShowcase from "@/components/ui/tumble-deck-showcase";
import type { Project } from "@/lib/projects";

/* *************************
 * ClientWorkDeck
 * Shows real client projects as a scroll-driven tumble deck, with a caption
 * for whichever project is at the front and a link into its case study.
 *
 * @param projects : the client projects to show, in order
 * @param tone : "light" for pale sections, "dark" for dark sections
 * @param showIndex : whether to list every project name under the deck
 * @exception none
 * @return the deck section with its caption
 **************************/
export default function ClientWorkDeck({ projects, tone = "light", showIndex = true }: { projects: Project[]; tone?: "light" | "dark"; showIndex?: boolean }) {
  const [active, setActive] = useState(0);
  const dark = tone === "dark";
  const project = projects[active] ?? projects[0];
  const cards = projects.map((p) => ({ src: p.image, alt: `${p.name} website preview`, href: `/work/${p.slug}` }));

  return (
    <>
      <TumbleDeckShowcase cards={cards} onActiveChange={setActive} ariaLabel="Real client work" background="transparent">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-8 sm:pb-12">
          <div className="v2-container flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div key={project.slug} className="td-caption max-w-xl">
              <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em] ${dark ? "text-stone-400" : "text-stone-500"}`}>
                <span className={dark ? "text-[#e08a5a]" : "text-terracotta"}>{String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
                <span aria-hidden="true">·</span>
                <span>{project.industry}</span>
              </p>
              <h3 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">{project.name}</h3>
              <p className={`mt-2 hidden leading-7 sm:block ${dark ? "text-stone-300" : "text-stone-600"}`}>{project.summary}</p>
            </div>
            <Link href={`/work/${project.slug}`} className={`v2-button pointer-events-auto ${dark ? "border-white/30 bg-white/10 text-white hover:border-white hover:bg-white/20" : "v2-button--secondary"} shrink-0 self-start sm:self-auto`}>
              View project <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
        <style>{`
          .td-caption { animation: td-caption-in .45s cubic-bezier(.2,.7,.2,1); }
          @keyframes td-caption-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
          @media (prefers-reduced-motion: reduce) { .td-caption { animation: none; } }
        `}</style>
      </TumbleDeckShowcase>
      {showIndex && <nav aria-label="All client projects" className="v2-container mt-10">
        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-stone-600">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}`} className="transition hover:text-terracotta">{p.name}</Link>
            </li>
          ))}
        </ul>
      </nav>}
    </>
  );
}
