import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import UnsubscribeButton from "./UnsubscribeButton";

export const metadata: Metadata = {
  alternates: { canonical: "/start/unsubscribe" },
  title: "Stop demo reminders | Trayfolio",
  description: "Stop reminder emails about an unfinished Trayfolio demo order.",
  robots: { index: false },
};

export default async function Unsubscribe({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const { token } = await searchParams;
  const value = typeof token === "string" ? token : "";

  return (
    <div className="flex min-h-screen flex-col bg-peach text-stone-900">
      <SiteHeader />
      <main id="main-content" className="flex-1 pb-[var(--stack-overlap)]">
        <section className="mx-auto max-w-xl px-6 py-24 text-center sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">Demo reminders</p>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight">Stop the reminder emails?</h1>
          <p className="mx-auto mt-5 max-w-md leading-7 text-stone-600">
            You started ordering a demo and I sent a reminder. If you&apos;re not interested right now, no hard feelings.
            Tap below and I won&apos;t email you about it again.
          </p>
          {value ? (
            <UnsubscribeButton token={value} />
          ) : (
            <p className="mt-8 text-stone-600">This link is missing part of it. Reply to the email and I&apos;ll stop them myself.</p>
          )}
          <Link href="/" className="mt-10 inline-block text-sm font-semibold text-stone-600 underline underline-offset-4 hover:text-stone-900">
            Back to Trayfolio
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
