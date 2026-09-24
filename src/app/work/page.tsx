import type { Metadata } from "next";
import MarketingShell from "@/components/MarketingShell";
import Reveal from "@/components/Reveal";
import { FinalCta, PageHero, PrimaryCta, ProjectCard } from "@/components/V2Ui";
import { clientProjects, conceptProjects } from "@/lib/projects";

export const metadata: Metadata = { title: "Work | Trayfolio", description: "Explore client websites and concept work designed and developed by Trayfolio.", alternates: { canonical: "/work" } };

export default function WorkPage() {
  return <MarketingShell>
    <PageHero eyebrow="Work" title="Different businesses deserve different digital worlds." intro="Explore real client work and clearly labeled concept projects. Each is built around a specific business, audience, and next step."><PrimaryCta /></PageHero>
    <section className="py-20 sm:py-28"><div className="v2-container"><Reveal><p className="v2-eyebrow text-terracotta">Real client work</p><h2 className="v2-section-title mt-4">Built for businesses in motion.</h2></Reveal><div className="mt-12 grid gap-6 lg:grid-cols-2">{clientProjects.map((project, index) => <Reveal key={project.slug} delay={(index % 2) * 80}><ProjectCard project={project} priority={index < 2} /></Reveal>)}</div></div></section>
    <section className="paper-texture py-20 sm:py-28"><div className="v2-container"><Reveal><p className="v2-eyebrow text-olive">Concept / demo work</p><h2 className="v2-section-title mt-4">Exploring what a business could become online.</h2><p className="mt-5 max-w-2xl leading-7 text-stone-600">These are Trayfolio-created concepts, not client engagements. They explore industry-specific ideas, motion, and customer experiences.</p></Reveal><div className="mt-12 grid gap-6 lg:grid-cols-3">{conceptProjects.map((project, index) => <Reveal key={project.slug} delay={index * 70}><ProjectCard project={project} /></Reveal>)}</div></div></section>
    <section className="bg-white py-20 sm:py-24"><div className="v2-container"><Reveal><p className="v2-eyebrow text-stone-500">Interaction studies</p><h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl">Small experiments. Useful ideas.</h2><p className="mt-4 max-w-2xl leading-7 text-stone-600">Hover reveals, scroll-scrubbed video, and motion studies live in the Trayfolio lab. They are experiments, not client projects, and may be best experienced with a mouse or larger screen.</p><div className="mt-7 flex flex-wrap gap-3"><a className="v2-button v2-button--secondary" href="/demos/image-reveal/">Hover reveal</a><a className="v2-button v2-button--secondary" href="/demos/scroll-trigger-video/">Scroll video</a></div></Reveal></div></section>
    <FinalCta />
  </MarketingShell>;
}
