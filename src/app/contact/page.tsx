import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import InquiryForm from "@/components/InquiryForm";
import Reveal from "@/components/Reveal";
import { Eyebrow } from "@/components/V2Ui";

export const metadata: Metadata = { title: "Send an Inquiry | Trayfolio", description: "Send Trayfolio a written website inquiry. Tracy typically replies within one business day.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return <MarketingShell>
    <section className="paper-texture border-b border-stone-900/10"><div className="v2-container py-20 sm:py-28"><Reveal><Eyebrow>Send an inquiry</Eyebrow><h1 className="v2-page-title mt-5 max-w-4xl">Tell Trayfolio what you&apos;re working on.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-stone-600">Have a detailed question, prefer email, or can&apos;t find a suitable call time? Send a note and Tracy will typically reply within one business day.</p></Reveal></div></section>
    <section className="bg-white py-20 sm:py-28"><div className="v2-container grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><Reveal><Eyebrow>Prefer to write instead?</Eyebrow><h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl">Send the details without scheduling a call.</h2><p className="mt-5 leading-7 text-stone-600">Use this form if you have a detailed question, would rather communicate by email, or cannot find a suitable time on the calendar. Tracy will reply by email within one business day.</p><div className="mt-7 border-t border-stone-200 pt-6"><p className="text-sm text-stone-600">Ready to talk now instead?</p><Link href="/book" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-terracotta underline underline-offset-4"><Calendar size={16} aria-hidden="true" />Book a Free 15-Minute Call</Link></div></Reveal><Reveal delay={100}><div id="inquiry-form" className="rounded-[2rem] border border-stone-200 bg-stone-50 p-6 shadow-sm sm:p-10"><InquiryForm /></div></Reveal></div></section>
  </MarketingShell>;
}
