import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check } from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import Reveal from "@/components/Reveal";
import SeeTheDifference from "@/components/SeeTheDifference";
import DemoCheckoutButton from "@/components/DemoCheckoutButton";
import { Eyebrow, FinalCta, PrimaryCta, ProjectCard, SecondaryCta } from "@/components/V2Ui";
import { featuredProjects } from "@/lib/projects";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Trayfolio | Custom websites for small businesses",
  description: "Trayfolio designs and develops custom websites for small businesses nationwide. Book a free 15-minute call or get a $50 website demo in 48 hours.",
};

const principles = [
  { number: "01", title: "Built around your business", body: "Structure, messaging, and functionality begin with how your business actually works—not a template waiting for a logo." },
  { number: "02", title: "Designed to earn trust", body: "Clear hierarchy, thoughtful details, and a professional experience make the business feel credible on every screen." },
  { number: "03", title: "Made to move people", body: "Every page gives visitors a clear next step, whether that is calling, booking, buying, or visiting." },
];

const process = [
  ["Discover", "A free 15-minute conversation about your business, audience, goals, and immediate needs."],
  ["Define", "Trayfolio recommends the right scope, timeline, and investment based on that conversation."],
  ["Design & build", "The website takes shape through a focused process with clear review points."],
  ["Launch & support", "Final checks, a confident launch, and the support agreed for what comes next."],
];

export default function Home() {
  return (
    <MarketingShell>
      <section className="paper-texture relative min-h-[calc(100svh-72px)] overflow-hidden border-b border-stone-900/10">
        <div className="grain-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="v2-container relative flex min-h-[calc(100svh-72px)] flex-col justify-center py-16 sm:py-24">
          <div className="max-w-5xl">
            <Eyebrow>Web design & development for small businesses</Eyebrow>
            <h1 className="v2-home-title mt-6">A better website for the business <span className="text-terracotta">you&apos;re building.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl">Trayfolio designs and develops custom websites that help small businesses look credible, stand out, and make the next step clear.</p>
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <PrimaryCta />
              <SecondaryCta />
              <Link href="#selected-work" className="inline-flex min-h-12 items-center justify-center gap-2 px-3 text-sm font-semibold text-stone-700 underline decoration-stone-400 underline-offset-4 transition hover:text-stone-950">View selected work <ArrowDown size={15} aria-hidden="true" /></Link>
            </div>
            <p className="mt-5 text-sm text-stone-500">Free 15-minute phone or video call. Serving small businesses nationwide.</p>
          </div>
        </div>
      </section>

      <section id="selected-work" className="bg-stone-950 py-20 text-white sm:py-28">
        <div className="v2-container">
          <Reveal><div className="grid gap-5 lg:grid-cols-[1fr_.8fr] lg:items-end"><div><Eyebrow light>Selected client work</Eyebrow><h2 className="v2-section-title mt-4 max-w-3xl">Built around the business. Never around a template.</h2></div><p className="max-w-xl leading-7 text-stone-300 lg:justify-self-end">Three businesses with three different goals, audiences, and digital experiences. Select a project to explore it inside Trayfolio.</p></div></Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {featuredProjects.map((project, index) => <Reveal key={project.slug} delay={index * 75} className={index === 0 ? "lg:col-span-2" : ""}><ProjectCard project={project} /></Reveal>)}
          </div>
          <Link href="/work" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">Explore all work <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="paper-texture py-20 sm:py-28">
        <div className="v2-container">
          <Reveal><Eyebrow>Why Trayfolio</Eyebrow><h2 className="v2-section-title mt-4 max-w-4xl">A website should feel like your business—not everyone else&apos;s.</h2></Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-stone-900/10 bg-stone-900/10 md:grid-cols-3">
            {principles.map((item, index) => <Reveal key={item.number} delay={index * 80} className="bg-[#fffdf9] p-7 sm:p-9"><span className="text-xs font-bold tracking-[.14em] text-terracotta">{item.number}</span><h3 className="font-display mt-6 text-2xl tracking-tight">{item.title}</h3><p className="mt-4 leading-7 text-stone-600">{item.body}</p></Reveal>)}
          </div>
        </div>
      </section>

      <SeeTheDifference />

      <section className="bg-terracotta py-20 text-white sm:py-28">
        <div className="v2-container grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <Reveal><Eyebrow light>$50 website demo</Eyebrow><h2 className="v2-section-title mt-4 max-w-3xl">See your business as a custom website—in 48 hours.</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">Trayfolio creates a custom website demo around your actual business. If you move forward with a full website, the $50 is credited toward the project.</p><div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"><DemoCheckoutButton className="demo-button-on-dark" /><Link href="/demo" className="text-sm font-semibold underline decoration-white/50 underline-offset-4">How the demo works</Link></div></Reveal>
          <Reveal delay={120}><ol className="grid gap-4">{["Purchase the $50 demo through secure Stripe checkout.", "Share the essentials about your business.", "Receive your custom demo within 48 hours."].map((step, index) => <li key={step} className="flex gap-4 rounded-2xl border border-white/20 bg-white/10 p-5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white font-semibold text-terracotta">{index + 1}</span><p className="pt-1 leading-7 text-white/90">{step}</p></li>)}</ol></Reveal>
        </div>
      </section>

      <section className="bg-[#fffdf9] py-20 sm:py-28">
        <div className="v2-container">
          <Reveal><Eyebrow>The process</Eyebrow><h2 className="v2-section-title mt-4">Clear from first call to launch.</h2></Reveal>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{process.map(([title, body], index) => <Reveal key={title} delay={index * 70}><li className="border-t border-stone-300 pt-5"><span className="text-sm font-semibold text-terracotta">0{index + 1}</span><h3 className="font-display mt-5 text-2xl tracking-tight">{title}</h3><p className="mt-3 leading-7 text-stone-600">{body}</p></li></Reveal>)}</ol>
        </div>
      </section>

      <section className="paper-texture py-20 sm:py-28">
        <div className="v2-container grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
          <Reveal><div className="grid aspect-square max-w-sm place-items-center rounded-[2rem] border border-stone-900/10 bg-stone-950 text-white shadow-2xl"><span className="font-display text-[clamp(5rem,14vw,9rem)] tracking-[-.08em]">TH</span></div></Reveal>
          <Reveal delay={100}><Eyebrow>Behind Trayfolio</Eyebrow><h2 className="v2-section-title mt-4">One point of contact from first idea to launch.</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">Trayfolio was founded by Tracy Holbrook to give small businesses a more thoughtful, direct way to get a custom website. You work with the person designing and building the site—without layers of handoffs.</p><Link href="/about" className="mt-7 inline-flex items-center gap-2 font-semibold text-terracotta underline decoration-terracotta/30 underline-offset-4">More about Trayfolio <ArrowRight size={16} aria-hidden="true" /></Link></Reveal>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white py-12"><div className="v2-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-display text-2xl tracking-tight">Custom scope. Clear next steps.</p><p className="mt-1 text-stone-600">Project requirements, timing, and pricing are discussed before work begins.</p></div><div className="flex items-center gap-2 text-sm font-semibold text-olive"><Check size={18} aria-hidden="true" /> No public package maze</div></div></section>

      <FinalCta />
    </MarketingShell>
  );
}
