import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Page not found | Trayfolio",
  description: "This page doesn't exist. Head back to Trayfolio's homepage.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-900">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center sm:py-32">
          <Reveal>
            <p className="font-display text-7xl font-semibold tracking-tight text-terracotta sm:text-8xl">
              404
            </p>
            <p className="font-display mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              This page doesn&apos;t exist.
            </p>
            <p className="mx-auto mt-4 max-w-sm text-stone-600">
              The link might be broken, or the page may have moved. Let&apos;s get you back
              to somewhere real.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                className="rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-light"
              >
                Back to homepage
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold text-stone-700 underline decoration-stone-400 underline-offset-4 transition hover:text-stone-900"
              >
                Get in touch instead
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
