import type { Metadata } from "next";
import { Calendar, Clock, Mail, Video } from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import InquiryForm from "@/components/InquiryForm";
import Reveal from "@/components/Reveal";
import { Eyebrow } from "@/components/V2Ui";

export const metadata: Metadata = { title: "Book a Free Call | Trayfolio", description: "Book a free 15-minute phone or video call with Trayfolio, or send a website project inquiry.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return <MarketingShell>
    <section className="paper-texture border-b border-stone-900/10"><div className="v2-container py-20 sm:py-28"><Reveal><Eyebrow>Book a free call</Eyebrow><h1 className="v2-page-title mt-5 max-w-4xl">Let&apos;s talk about what your website needs to do.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-stone-600">Start with a free 15-minute conversation about your business, goals, and what should happen next. Choose a phone or video call when scheduling is available.</p><div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">{[[Clock, "15 minutes"], [Video, "Phone or video"], [Calendar, "Free consultation"]].map(([Icon, label]) => { const ItemIcon = Icon as typeof Clock; return <div key={label as string} className="flex items-center gap-3 rounded-2xl border border-stone-900/10 bg-white/60 p-4 text-sm font-semibold"><ItemIcon className="text-terracotta" size={18} aria-hidden="true" />{label as string}</div>; })}</div></Reveal></div></section>
    <section className="bg-white py-20 sm:py-28"><div className="v2-container grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><Reveal><Eyebrow>Request your call</Eyebrow><h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl">The scheduling calendar is coming next.</h2><p className="mt-5 leading-7 text-stone-600">Trayfolio is choosing the external scheduling provider that will handle real availability and the phone/video choice. For now, send your details here and Tracy will follow up to arrange the free call.</p><div className="mt-7 rounded-2xl bg-peach p-5"><p className="text-sm font-semibold">Prefer email?</p><a href="mailto:tracyholbrook532@gmail.com" className="mt-2 flex items-center gap-2 break-all text-sm text-terracotta underline underline-offset-4"><Mail size={16} aria-hidden="true" />tracyholbrook532@gmail.com</a></div></Reveal><Reveal delay={100}><div id="inquiry-form" className="rounded-[2rem] border border-stone-200 bg-stone-50 p-6 shadow-sm sm:p-10"><InquiryForm /></div></Reveal></div></section>
  </MarketingShell>;
}
