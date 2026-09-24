import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Mail } from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import InquiryForm from "@/components/InquiryForm";
import Reveal from "@/components/Reveal";
import { Eyebrow } from "@/components/V2Ui";

export const metadata: Metadata = { title: "Send an Inquiry | Trayfolio", description: "Send Trayfolio a written website inquiry. Tracy typically replies within one business day.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return <MarketingShell>
    <section className="paper-texture border-b border-stone-900/10"><div className="v2-container py-20 sm:py-28"><Reveal><Eyebrow>Send an inquiry</Eyebrow><h1 className="v2-page-title mt-5 max-w-4xl">Tell Trayfolio what you&apos;re working on.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-stone-600">Have a detailed question, prefer email, or can&apos;t find a suitable call time? Send a note and Tracy will typically reply within one business day.</p></Reveal></div></section>
    <section className="bg-white py-20 sm:py-28"><div className="v2-container grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><Reveal><Eyebrow>Written inquiry</Eyebrow><h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl">Share the essentials. We&apos;ll take it from there.</h2><p className="mt-5 leading-7 text-stone-600">A few details about your business and what you need are enough to begin. There is no long project questionnaire at this stage.</p><Link href="/book" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-terracotta underline underline-offset-4"><Calendar size={16} aria-hidden="true" />Want to talk sooner? Book a Free 15-Minute Call.</Link><div className="mt-7 rounded-2xl bg-peach p-5"><p className="text-sm font-semibold">Prefer direct email?</p><a href="mailto:tracyholbrook532@gmail.com" className="mt-2 flex items-center gap-2 break-all text-sm text-terracotta underline underline-offset-4"><Mail size={16} aria-hidden="true" />tracyholbrook532@gmail.com</a></div></Reveal><Reveal delay={100}><div id="inquiry-form" className="rounded-[2rem] border border-stone-200 bg-stone-50 p-6 shadow-sm sm:p-10"><InquiryForm /></div></Reveal></div></section>
  </MarketingShell>;
}
