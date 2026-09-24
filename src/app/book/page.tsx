import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Calendar, Clock, Video } from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import Reveal from "@/components/Reveal";
import { Eyebrow } from "@/components/V2Ui";
import { CAL_BOOKING_URL } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Book a Free Call | Trayfolio",
  description:
    "Book a free 15-minute phone or video call with Trayfolio to talk about your business and website goals.",
  alternates: { canonical: "/book" },
};

const callDetails = [
  [Clock, "15 minutes"],
  [Video, "Phone or video"],
  [Calendar, "Free consultation"],
] as const;

export default function BookPage() {
  return (
    <MarketingShell>
      <section className="paper-texture border-b border-stone-900/10">
        <div className="v2-container py-16 sm:py-24">
          <Reveal>
            <Eyebrow>Book a free call</Eyebrow>
            <h1 className="v2-page-title mt-5 max-w-4xl">
              Let&apos;s talk about what your website needs to do.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-600">
              Pick a time for a short, no-pressure conversation about your
              business, website goals, and the clearest next step.
            </p>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Call details
            </p>
            <ul className="mt-4 flex max-w-2xl flex-wrap gap-x-7 gap-y-3" aria-label="Call details">
              {callDetails.map(([Icon, label]) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-sm font-semibold text-stone-700"
                >
                  <Icon className="text-terracotta" size={18} aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="v2-container max-w-5xl">
          <Reveal>
            <div className="rounded-[2rem] bg-stone-950 px-6 py-12 text-center text-white shadow-[0_30px_90px_-55px_rgba(42,33,24,.55)] sm:px-12 sm:py-16">
              <Calendar className="mx-auto text-gold" size={34} aria-hidden="true" />
              <Eyebrow light>Live availability</Eyebrow>
              <h2 className="font-display mx-auto mt-4 max-w-2xl text-4xl leading-tight tracking-[-.04em] sm:text-5xl">
                Choose the time that works for you.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-stone-300">
                View Tracy&apos;s current calendar, select phone or video, and receive your confirmation instantly.
              </p>
              <a
                href={CAL_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="v2-button v2-button--primary mt-8"
              >
                View Available Times
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </Reveal>

          <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-3xl bg-peach p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="font-display text-2xl tracking-tight">Can&apos;t find a time that works?</p>
              <p className="mt-2 leading-7 text-stone-600">
                Send a written inquiry and Trayfolio will follow up by email.
              </p>
            </div>
            <Link href="/contact" className="v2-button v2-button--secondary">
              Send an Inquiry
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
