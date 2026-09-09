import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProjectBuilder from "@/components/ProjectBuilder";

export const metadata: Metadata = {
  alternates: { canonical: "/start" },
  title: "Start your project | Trayfolio",
  description:
    "Pick a package, add what you need, and pay a 50% deposit to get started. Balance due at launch.",
};

export default function StartPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-900">
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-[var(--stack-overlap)]">
        <section className="mx-auto max-w-6xl px-6 pb-10 pt-16 sm:pt-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-stone-500">
            Start your project
          </p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Build it, see the price, pay half.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600">
            The number updates as you go, and nothing is hidden. You pay 50% to start and
            the rest when your site goes live.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <Suspense fallback={<p className="text-stone-500">Loading the builder...</p>}>
            <ProjectBuilder />
          </Suspense>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
