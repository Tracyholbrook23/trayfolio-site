import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Privacy Policy | Trayfolio",
  description: "Privacy policy for Trayfolio.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
          <Reveal>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
              Privacy Policy
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-6 text-lg leading-relaxed text-stone-600">
              A full privacy policy is coming soon. In the meantime, if you have any
              questions about how your information is handled when you contact Trayfolio
              or use this site, reach out directly and I&apos;ll be happy to help.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <a
              href="mailto:tracyholbrook532@gmail.com"
              className="mt-8 inline-block rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-light"
            >
              Contact me with questions
            </a>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
