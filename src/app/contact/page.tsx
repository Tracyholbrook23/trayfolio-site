import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Contact | Trayfolio",
  description:
    "Start a website project with Trayfolio. Tell me about your business and get a reply within one business day.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-900">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-24 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <h1 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                Let&apos;s build something
              </h1>
              <p className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to start your website?
              </p>
              <p className="mt-4 max-w-sm text-stone-600">
                Tell me a bit about your business and what you need. I read every inquiry
                myself and usually reply within a business day.
              </p>
              <div className="mt-8 space-y-3 text-sm text-stone-600">
                <p>
                  <span className="font-semibold text-stone-900">Email: </span>
                  <a
                    href="mailto:tracyholbrook532@gmail.com"
                    className="underline decoration-stone-300 underline-offset-4 hover:text-stone-900"
                  >
                    tracyholbrook532@gmail.com
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-stone-900">Response time: </span>
                  Within 1 business day
                </p>
              </div>
            </Reveal>
            <Reveal delay={150} className="lg:col-span-3">
              <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6 sm:p-10">
                <InquiryForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
