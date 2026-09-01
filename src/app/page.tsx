import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import InquiryForm from "@/components/InquiryForm";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";

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

const demoSlides: CoverflowSlide[] = [
  {
    src: "/demos/construction/assets/construction-crane-modern-residential-complex-near-water-new-housing-by-lake.jpg",
    alt: "STRUX construction demo site — modern residential build with crane",
    title: "STRUX",
    subtitle: "Construction & infrastructure — live demo",
    href: "/demos/construction/",
    linkLabel: "Scroll through the live demo",
    meta: [
      { label: "Industry", value: "Construction & trades" },
      { label: "Signature move", value: "Scroll-scrubbed hero video" },
    ],
  },
  {
    src: "/demos/holiday-lighting/christmas-lights/3-house-lights-on.png",
    alt: "Evergreen Holiday Lighting demo site — before and after house lighting reveal",
    title: "Evergreen Holiday Lighting",
    subtitle: "Seasonal home services — live demo",
    href: "/demos/holiday-lighting/",
    linkLabel: "Scroll through the live demo",
    meta: [
      { label: "Industry", value: "Home services" },
      { label: "Signature move", value: "Before/after scroll reveal" },
    ],
  },
  {
    src: "/demos/image-reveal/front.jpg",
    alt: "Hover reveal effect demo — construction crew reviewing blueprints",
    title: "Hover Reveal",
    subtitle: "Interactive effect — click to try it live",
    href: "/demos/image-reveal/",
    linkLabel: "Try the live effect",
    meta: [
      { label: "Effect", value: "Radial image reveal" },
      { label: "Trigger", value: "Mouse / touch" },
    ],
  },
  {
    src: "/demos/mouse-scrub/poster.jpg",
    alt: "Mouse-driven video scrub effect demo — luxury apartment building at dusk",
    title: "Mouse-Scrub Video",
    subtitle: "Interactive effect — click to try it live",
    href: "/demos/mouse-scrub/",
    linkLabel: "Try the live effect",
    meta: [
      { label: "Effect", value: "Video scrubbing" },
      { label: "Trigger", value: "Mouse movement" },
    ],
  },
  {
    src: "/demos/scroll-trigger-video/poster.jpg",
    alt: "Scroll-triggered video playback effect demo — apartment balconies at sunset",
    title: "Scroll-Triggered Video",
    subtitle: "Interactive effect — click to try it live",
    href: "/demos/scroll-trigger-video/",
    linkLabel: "Try the live effect",
    meta: [
      { label: "Effect", value: "Scroll-locked playback" },
      { label: "Trigger", value: "Scroll or swipe" },
    ],
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
    <div className="flex flex-col flex-1 bg-white text-stone-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-peach/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-display text-lg font-semibold tracking-tight">Trayfolio</span>
          <div className="hidden gap-8 text-sm font-medium text-stone-600 sm:flex">
            <a href="#work" className="hover:text-stone-900">Work</a>
            <a href="#demos" className="hover:text-stone-900">Demos</a>
            <a href="#services" className="hover:text-stone-900">Services</a>
            <Link href="/packages" className="hover:text-stone-900">Packages</Link>
            <a href="#contact" className="hover:text-stone-900">Contact</a>
          </div>
          <a
            href="#contact"
            className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-light"
          >
            Get in touch
          </a>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section id="demos" className="relative overflow-hidden bg-peach text-stone-900">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="blob absolute left-[-10%] top-[-15%] h-[420px] w-[420px] rounded-full bg-white/50 blur-3xl"
              style={{ animation: "blob-float 16s ease-in-out infinite" }}
            />
            <div
              className="blob absolute right-[-10%] top-[5%] h-[380px] w-[380px] rounded-full bg-gold/20 blur-3xl"
              style={{ animation: "blob-float 20s ease-in-out infinite reverse" }}
            />
            <div
              className="blob absolute bottom-[-20%] left-[25%] h-[360px] w-[360px] rounded-full bg-white/40 blur-3xl"
              style={{ animation: "blob-float 22s ease-in-out infinite" }}
            />
            <div className="grain-overlay absolute inset-0" />
          </div>

          <div className="mx-auto max-w-5xl px-6 pb-8 pt-12 sm:pt-16">
            <Reveal>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-500">
                Websites for small businesses
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-display max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
                A website that makes people <span className="gradient-text">stop scrolling</span>{" "}
                and start clicking.
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
                I design and build custom websites for small businesses — apparel, home
                services, trades, sports, photography, and everything in between.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-light"
                >
                  Start your project
                </a>
                <a
                  href="#demo-carousel"
                  className="rounded-full border border-stone-900/20 px-6 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-900/40 hover:bg-white/40"
                >
                  See live demos
                </a>
              </div>
            </Reveal>
            <Reveal delay={350}>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
                {trustBadges.map((badge) => (
                  <span key={badge} className="flex items-center gap-1.5">
                    <span className="text-terracotta">✓</span>
                    {badge}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Live demo carousel */}
          <Reveal delay={150} id="demo-carousel" className="pb-14 pt-2">
            <div className="mx-auto max-w-5xl px-6">
              <p className="text-center text-sm font-semibold uppercase tracking-wider text-stone-500">
                Drag through a few live builds
              </p>
              <p className="mx-auto mt-1.5 max-w-md text-center text-sm text-stone-600">
                Real, interactive demo sites and effects — drag the cards, then click one to try
                it for real.
              </p>
            </div>
            <div className="mt-6">
              <CoverflowCarousel
                slides={demoSlides}
                cardWidth="clamp(200px, 30vw, 360px)"
                showCaption
                showPagination
                showNavigation
                label="Live website demos"
              />
            </div>
          </Reveal>
        </section>

        {/* Recent work strip */}
        <section id="work" className="border-t border-stone-100 bg-stone-50">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <Reveal>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
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
                    className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
                      <Image
                        src={project.image}
                        alt={`${project.name} website screenshot`}
                        fill
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="mt-1 text-sm text-stone-600">{project.description}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="border-t border-stone-100 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <Reveal>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                What I actually do
              </h2>
              <p className="font-display mt-2 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Three services. No bloat.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {services.map((service, i) => (
                <Reveal key={service.number} delay={i * 100}>
                  <span className="text-sm font-semibold text-terracotta">{service.number}</span>
                  <h3 className="mt-2 font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{service.description}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Packages teaser */}
        <section className="border-t border-stone-100 bg-peach text-stone-900">
          <div className="mx-auto max-w-5xl px-6 py-16 text-center">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-stone-600">
                Pricing, upfront
              </p>
              <p className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Sites from $700
              </p>
              <p className="mt-3 text-stone-600">
                No hidden monthly fee if you don&apos;t want one.
              </p>
              <Link
                href="/packages"
                className="mt-6 inline-block rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-light"
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
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                Let&apos;s build something
              </h2>
              <p className="font-display mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to start your website?
              </p>
              <p className="mt-4 max-w-sm text-stone-600">
                Tell me a bit about your business and what you need. I read every inquiry
                myself and usually reply within a business day.
              </p>
              <div className="mt-8 space-y-3 text-sm text-stone-600">
                <p>
                  <span className="font-semibold text-stone-900">Email — </span>
                  <a
                    href="mailto:tracyholbrook532@gmail.com"
                    className="underline decoration-stone-300 underline-offset-4 hover:text-stone-900"
                  >
                    tracyholbrook532@gmail.com
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-stone-900">Response time — </span>
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

      <footer className="border-t border-stone-100 py-10 text-sm text-stone-500">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Trayfolio. Built by Tracy Holbrook.</span>
          <div className="flex gap-6">
            <a href="#work" className="hover:text-stone-900">Work</a>
            <a href="#demos" className="hover:text-stone-900">Demos</a>
            <a href="#services" className="hover:text-stone-900">Services</a>
            <Link href="/packages" className="hover:text-stone-900">Packages</Link>
            <a href="#contact" className="hover:text-stone-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
