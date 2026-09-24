import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { Project } from "@/lib/projects";

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`v2-eyebrow ${light ? "text-white/60" : "text-stone-500"}`}>{children}</p>;
}

export function PrimaryCta({ href = "/contact", children = "Book a Free Call", className = "" }: { href?: string; children?: ReactNode; className?: string }) {
  return <Link href={href} className={`v2-button v2-button--primary ${className}`}>{children}<ArrowRight aria-hidden="true" size={16} /></Link>;
}

export function SecondaryCta({ href = "/demo", children = "Get a $50 Demo", light = false, className = "" }: { href?: string; children?: ReactNode; light?: boolean; className?: string }) {
  return <Link href={href} className={`v2-button ${light ? "v2-button--light" : "v2-button--secondary"} ${className}`}>{children}</Link>;
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children?: ReactNode }) {
  return (
    <section className="paper-texture relative overflow-hidden border-b border-stone-900/10">
      <div className="grain-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="v2-container relative py-20 sm:py-28 lg:py-32">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="v2-page-title mt-5 max-w-4xl">{title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl">{intro}</p>
          {children ? <div className="mt-9 flex flex-wrap gap-3">{children}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-[0_24px_70px_-45px_rgba(42,33,24,.45)]">
      <Link href={`/work/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
          <Image src={project.image} alt={`${project.name} website preview`} fill priority={priority} sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1199px) 48vw, 580px" className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.025]" />
        </div>
        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
            <span className={project.classification === "client" ? "text-terracotta" : "text-olive"}>{project.classificationLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{project.industry}</span>
          </div>
          <div className="mt-4 flex items-start justify-between gap-5">
            <div>
              <h2 className="font-display text-2xl tracking-tight sm:text-3xl">{project.name}</h2>
              <p className="mt-3 max-w-xl leading-7 text-stone-600">{project.summary}</p>
            </div>
            <ArrowUpRight className="mt-1 shrink-0 text-stone-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-terracotta" aria-hidden="true" />
          </div>
        </div>
      </Link>
    </article>
  );
}

export function FinalCta() {
  return (
    <section className="bg-stone-950 text-white">
      <div className="v2-container py-20 text-center sm:py-28">
        <Reveal>
          <Eyebrow light>Start with the path that fits</Eyebrow>
          <h2 className="font-display mx-auto mt-5 max-w-3xl text-4xl leading-[.98] tracking-[-.04em] sm:text-6xl">Ready to give your business a stronger place online?</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-stone-300">Book a free conversation, or see a custom direction for your business with a $50 demo.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryCta />
            <SecondaryCta light />
          </div>
          <p className="mt-5 text-sm text-stone-400">Not sure which is right? Start with the free 15-minute call.</p>
        </Reveal>
      </div>
    </section>
  );
}
