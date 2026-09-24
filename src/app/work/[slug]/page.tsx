import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import Reveal from "@/components/Reveal";
import { FinalCta } from "@/components/V2Ui";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found | Trayfolio" };
  return { title: `${project.name} | Trayfolio Work`, description: project.summary, alternates: { canonical: `/work/${project.slug}` } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const destination = project.liveUrl ?? project.demoUrl;
  return <MarketingShell>
    <article>
      <header className="bg-stone-950 pb-16 pt-12 text-white sm:pb-24 sm:pt-16"><div className="v2-container"><Link href="/work" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"><ArrowLeft size={16} aria-hidden="true" />All work</Link><div className="mt-14 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="v2-eyebrow text-terracotta-light">{project.classificationLabel} · {project.industry}</p><h1 className="v2-page-title mt-5">{project.name}</h1></div><p className="text-lg leading-8 text-stone-300">{project.summary}</p></div></div></header>
      <div className="bg-stone-950"><div className="v2-container"><div className="relative aspect-[16/8] overflow-hidden rounded-t-[2rem] bg-stone-900"><Image src={project.image} alt={`${project.name} website experience`} fill priority sizes="100vw" className="object-cover object-top" /></div></div></div>
      <section className="paper-texture py-20 sm:py-28"><div className="v2-container grid gap-12 lg:grid-cols-[.65fr_1.35fr]"><Reveal><p className="v2-eyebrow text-stone-500">At a glance</p><dl className="mt-6 space-y-6"><div><dt className="text-xs font-semibold uppercase tracking-wider text-stone-500">Category</dt><dd className="mt-1 font-semibold">{project.classificationLabel}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-wider text-stone-500">Industry</dt><dd className="mt-1 font-semibold">{project.industry}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-wider text-stone-500">Services</dt><dd className="mt-2 flex flex-wrap gap-2">{project.services.map((service) => <span key={service} className="rounded-full border border-stone-300 bg-white/60 px-3 py-1.5 text-sm">{service}</span>)}</dd></div></dl></Reveal><div className="space-y-14"><Reveal><p className="v2-eyebrow text-stone-500">{project.classification === "client" ? "The need" : "The scenario"}</p><h2 className="font-display mt-4 text-3xl leading-tight tracking-tight sm:text-5xl">{project.need}</h2></Reveal><Reveal><p className="v2-eyebrow text-stone-500">The approach</p><p className="mt-4 max-w-3xl text-xl leading-9 text-stone-700">{project.approach}</p></Reveal><Reveal><p className="v2-eyebrow text-stone-500">The experience</p><p className="mt-4 max-w-3xl text-xl leading-9 text-stone-700">{project.experience}</p></Reveal>{destination ? <Reveal><a href={destination} target={project.liveUrl ? "_blank" : undefined} rel={project.liveUrl ? "noopener noreferrer" : undefined} className="v2-button v2-button--primary">{project.liveUrl ? "Visit live site" : "Open live demo"}<ArrowUpRight size={16} aria-hidden="true" /></a>{project.liveUrl ? <p className="mt-3 text-xs text-stone-500">Opens the current live website in a new tab.</p> : null}</Reveal> : null}</div></div></section>
    </article>
    <FinalCta />
  </MarketingShell>;
}
