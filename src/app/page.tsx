import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import DemoShowcase from "@/components/DemoShowcase";
import InquiryForm from "@/components/InquiryForm";

const work = [
  {
    name: "Valtier Media",
    description: "Austin photography & videography studio",
    image: "/work/valtiermedia.jpg",
    href: "https://www.valtiermedia.com",
  },
  {
    name: "MØDE",
    description: "Custom membership platform",
    image: "/work/mode.jpg",
    href: "https://www.enterm0de.com",
  },
  {
    name: "Shawnie's Loc Lab",
    description: "Loc & braid specialist, Lansing MI",
    image: "/work/shawniesloclab.jpg",
    href: "https://www.shawniesloclab.com",
  },
];

const trustBadges = [
  "Flat, upfront pricing",
  "Usually live in 1-2 weeks",
  "You own the site & domain",
  "Direct support from me, not a call center",
];

const services = [
  {
    number: "01",
    title: "Website Creation",
    description:
      "Built around your real business — your services, your photos, your customers — not a template with your logo dropped in.",
  },
  {
    number: "02",
    title: "Website Redesigns",
    description:
      "A modern look and faster load times for a site that's outdated, slow, or doesn't work well on phones.",
  },
  {
    number: "03",
    title: "Care & Support",
    description:
      "Ongoing edits, monitoring, and small changes after launch, billed month to month — cancel anytime.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-white text-zinc-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-display text-lg font-semibold tracking-tight">Trayfolio</span>
          <div className="hidden gap-8 text-sm font-medium text-zinc-600 sm:flex">
            <a href="#work" className="hover:text-zinc-900">Work</a>
            <a href="#demos" className="hover:text-zinc-900">Demos</a>
            <a href="#services" className="hover:text-zinc-900">Services</a>
            <Link href="/packages" className="hover:text-zinc-900">Packages</Link>
            <a href="#contact" className="hover:text-zinc-900">Contact</a>
          </div>
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/20 transition hover:brightness-110"
          >
            Get in touch
          </a>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-zinc-950 text-white">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="blob absolute left-[-10%] top-[-15%] h-[420px] w-[420px] rounded-full bg-violet-600/40 blur-3xl"
              style={{ animation: "blob-float 16s ease-in-out infinite" }}
            />
            <div
              className="blob absolute right-[-10%] top-[5%] h-[380px] w-[380px] rounded-full bg-fuchsia-500/30 blur-3xl"
              style={{ animation: "blob-float 20s ease-in-out infinite reverse" }}
            />
            <div
              className="blob absolute bottom-[-20%] left-[25%] h-[360px] w-[360px] rounded-full bg-orange-400/25 blur-3xl"
              style={{ animation: "blob-float 22s ease-in-out infinite" }}
            />
            <div className="grain-overlay absolute inset-0" />
          </div>

          <div className="mx-auto max-w-5xl px-6 pb-28 pt-20 sm:pt-28">
            <Reveal>
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Websites for small businesses
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-display max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
                A website that makes people <span className="gradient-text">stop scrolling</span>{" "}
                and start clicking.
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
                I design and build custom websites for small businesses — apparel, home
                services, trades, sports, photography, and everything in between. Fast, clear,
                and made to turn visitors into customers.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:brightness-110 hover:shadow-fuchsia-500/40"
                >
                  Start your project
                </a>
                <a
                  href="#demos"
                  className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  See demo styles
                </a>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-sm text-zinc-400">
                {trustBadges.map((badge) => (
                  <span key={badge} className="flex items-center gap-2">
                    <span className="text-fuchsia-400">✓</span>
                    {badge}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <a
            href="#work"
            aria-label="Scroll to see recent work"
            className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce text-2xl text-zinc-500 transition hover:text-white sm:block"
          >
            ↓
          </a>
        </section>

        {/* Recent work strip */}
        <section id="work" className="border-t border-zinc-100 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <Reveal>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Recent work
              </h2>
            </Reveal>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {work.map((project, i) => (
                <Reveal key={project.name} delay={i * 100}>
                  <Link
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                      <Image
                        src={project.image}
                        alt={`${project.name} website screenshot`}
                        fill
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="mt-1 text-sm text-zinc-600">{project.description}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Demo showcase */}
        <section id="demos" className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              See the range
            </h2>
            <p className="font-display mt-2 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
              One studio, any industry.
            </p>
            <p className="mt-3 max-w-xl text-zinc-600">
              Shopify and apparel, home services and trades, sports, photography — pick a
              category to see a taste of the style that fits it.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-10">
            <DemoShowcase />
          </Reveal>
        </section>

        {/* Services */}
        <section id="services" className="border-t border-zinc-100 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <Reveal>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                What I actually do
              </h2>
              <p className="font-display mt-2 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Three services. No bloat.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {services.map((service, i) => (
                <Reveal key={service.number} delay={i * 100}>
                  <span className="text-sm font-semibold text-zinc-400">{service.number}</span>
                  <h3 className="mt-2 font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{service.description}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Packages teaser */}
        <section className="border-t border-zinc-100 bg-zinc-900 text-white">
          <div className="mx-auto max-w-5xl px-6 py-16 text-center">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Pricing, upfront
              </p>
              <p className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Sites from $700
              </p>
              <p className="mt-3 text-zinc-400">
                No hidden monthly fee if you don&apos;t want one.
              </p>
              <Link
                href="/packages"
                className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
              >
                See full pricing
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Contact / inquiry */}
        <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Let&apos;s build something
              </h2>
              <p className="font-display mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to start your website?
              </p>
              <p className="mt-4 max-w-sm text-zinc-600">
                Tell me a bit about your business and what you need. I read every inquiry
                myself and usually reply within a business day.
              </p>
              <div className="mt-8 space-y-3 text-sm text-zinc-600">
                <p>
                  <span className="font-semibold text-zinc-900">Email — </span>
                  <a
                    href="mailto:tracyholbrook532@gmail.com"
                    className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900"
                  >
                    tracyholbrook532@gmail.com
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-zinc-900">Response time — </span>
                  Within 1 business day
                </p>
              </div>
            </Reveal>
            <Reveal delay={150} className="lg:col-span-3">
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-10">
                <InquiryForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 py-10 text-sm text-zinc-500">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Trayfolio. Built by Tracy Holbrook.</span>
          <div className="flex gap-6">
            <a href="#work" className="hover:text-zinc-900">Work</a>
            <a href="#demos" className="hover:text-zinc-900">Demos</a>
            <a href="#services" className="hover:text-zinc-900">Services</a>
            <Link href="/packages" className="hover:text-zinc-900">Packages</Link>
            <a href="#contact" className="hover:text-zinc-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
