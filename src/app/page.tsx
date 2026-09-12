import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import StackLayer from "@/components/StackLayer";
import LayeredWord from "@/components/LayeredWord";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SeeTheDifference from "@/components/SeeTheDifference";
import DeferredShaderAnimation from "@/components/DeferredShaderAnimation";
import DemoCheckoutButton from "@/components/DemoCheckoutButton";
import PortfolioIntro from "@/components/PortfolioIntro";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const work = [
  {
    name: "Out of Jersey Creations",
    description: "Custom laser engraving, California",
    image: "/work/outofjerseycreations.jpg",
    href: "https://www.outofjerseycreationshub.com",
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
  {
    name: "ATX Auto Detailing",
    description: "Mobile car detailing, Austin TX",
    image: "/work/autodetailingatx.jpg",
    href: "https://www.autodetailingatx.com",
  },
  {
    name: "RunCheck",
    description: "Pickup basketball app, Austin TX",
    image: "/work/runcheck.jpg",
    href: "https://www.theruncheck.app",
  },
  {
    name: "Valtier Media",
    description: "Austin photography & videography studio",
    image: "/work/valtiermedia.jpg",
    href: "https://www.valtiermedia.com",
  },
];

const demoSlides: CoverflowSlide[] = [
  {
    src: "/demos/construction/assets/construction-crane-modern-residential-complex-near-water-new-housing-by-lake.jpg",
    alt: "STRUX construction demo site: modern residential build with crane",
    title: "STRUX",
    subtitle: "Construction & infrastructure demo",
    href: "/demos/construction/",
    linkLabel: "Scroll through the live demo",
    meta: [
      { label: "Industry", value: "Construction & trades" },
      { label: "Signature move", value: "Scroll-scrubbed hero video" },
    ],
  },
  {
    src: "/demos/holiday-lighting/christmas-lights/3-house-lights-on.png",
    alt: "Evergreen Holiday Lighting demo site: before and after house lighting reveal",
    title: "Evergreen Holiday Lighting",
    subtitle: "Seasonal home services demo",
    href: "/demos/holiday-lighting/",
    linkLabel: "Scroll through the live demo",
    meta: [
      { label: "Industry", value: "Home services" },
      { label: "Signature move", value: "Before/after scroll reveal" },
    ],
  },
  {
    src: "/demos/image-reveal/front.jpg",
    alt: "Hover reveal effect demo: powered exosuit, hover to reveal the operator inside",
    title: "Hover Reveal",
    subtitle: "Interactive effect: click to try it live",
    href: "/demos/image-reveal/",
    linkLabel: "Try the live effect",
    meta: [{ label: "Effect", value: "Radial image reveal" }],
    interactionHint: {
      desktop: "Hover over the suit to see the effect",
      mobile: "Best viewed on desktop. Hover isn't available on touchscreens.",
    },
  },
  {
    src: "/work/autodetailingatx.jpg",
    alt: "ATX Auto Detailing landing-page demo",
    title: "ATX Auto Detailing",
    subtitle: "Mobile auto detailing landing-page demo",
    href: "/demos/autodetailing/index.html",
    linkLabel: "View the landing page",
    meta: [
      { label: "Industry", value: "Automotive services" },
      { label: "Signature move", value: "High-impact service landing page" },
    ],
  },
  {
    src: "/demos/nu2u-moving/hero-preview.png",
    alt: "Nu2U Moving and Delivery demo homepage hero",
    title: "Nu2U Moving & Delivery",
    subtitle: "Moving and delivery service demo",
    href: "/demos/nu2u-moving/",
    linkLabel: "Scroll through the live demo",
    meta: [
      { label: "Industry", value: "Moving & delivery" },
      { label: "Signature move", value: "Scroll-scrubbed loading sequence" },
    ],
  },
];

const services = [
  {
    number: "01",
    title: "Website Creation",
    description:
      "Built around your real business: your services, your photos, your customers, not a template with your logo dropped in.",
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
      "Ongoing edits, monitoring, and small changes after launch, billed month to month. Cancel anytime.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-white text-stone-900">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <PortfolioIntro />

        {/* The remaining work follows the large selected-work sequence. */}
        <section id="work" className="deferred-render bg-stone-50">
          <div className="mx-auto max-w-5xl px-6 py-24">
            <h2><LayeredWord text="More Work" /></h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {work.slice(0, 3).map((project, i) => (
                <Reveal key={project.name} delay={i * 75}>
                  <Link
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-xl"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
                      <Image
                        src={project.image}
                        alt={`${project.name} website screenshot`}
                        fill
                        sizes="(max-width: 639px) calc(100vw - 3rem), (max-width: 1023px) 45vw, 320px"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="mt-1 text-sm text-stone-600">{project.description}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Live demo carousel */}
        <StackLayer id="demos" noPad className="deferred-render bg-white">
          <div className="mx-auto max-w-5xl px-6 py-24">
            <Reveal>
              <p className="text-center text-sm font-semibold uppercase tracking-wider text-stone-500">
                Drag through a few live builds
              </p>
              <p className="mx-auto mt-1.5 max-w-md text-center text-sm text-stone-600">
                Real, interactive demo sites and effects. Drag the cards, then click one to try
                it for real.
              </p>
            </Reveal>
            <Reveal delay={150} className="mt-10">
              <CoverflowCarousel
                slides={demoSlides}
                cardWidth="clamp(200px, 30vw, 360px)"
                autoRotate
                autoRotateInterval={3800}
                showCaption
                showPagination
                showScrubber
                showNavigation
                label="Live website demos"
              />
            </Reveal>
            <Reveal delay={250} className="mt-12 flex flex-col items-center gap-4 text-center">
              <p className="max-w-sm text-sm text-stone-600">
                Want something like this for your own business? Get a real, live demo of
                your site for $50, credited back if you go on to buy.
              </p>
              <DemoCheckoutButton />
            </Reveal>
          </div>
        </StackLayer>

        <SeeTheDifference />

        {/* Services */}
        <section id="services" className="paper-texture deferred-render">
          <div className="mx-auto max-w-5xl px-6 py-28">
            <h2>
              <LayeredWord text="What I Do" />
            </h2>
            <Reveal>
              <p className="mt-6 max-w-xl text-lg text-stone-600">
                Three services. No bloat.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
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

        {/* Your site, your way */}
        <StackLayer noPad className="deferred-render bg-stone-950 text-white">
          <DeferredShaderAnimation />
          <div className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center sm:py-36">
            <Reveal>
              <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
                Your Site. Your Way.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-stone-300">
                Built around your business, your brand, and how you actually want to work
                with a designer. No templates, no hand-offs, no guesswork.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="rounded-full bg-terracotta px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-light"
                >
                  Let&apos;s talk
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Pricing
                </Link>
              </div>
            </Reveal>
          </div>
        </StackLayer>

        {/* Contact CTA */}
        <section id="contact" className="deferred-render bg-white">
          <div className="mx-auto max-w-2xl px-6 pt-28 pb-[calc(7rem+var(--stack-overlap))] text-center">
            <Reveal>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                Let&apos;s build something
              </h2>
              <p className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to start your website?
              </p>
              <p className="mx-auto mt-4 max-w-md text-stone-600">
                Tell me a bit about your business and what you need. I read every inquiry
                myself and usually reply within a business day.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-block rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-light"
              >
                Start your project
              </Link>
              <p className="mt-6 text-sm text-stone-500">
                Prefer email? Reach me at{" "}
                <a
                  href="mailto:tracyholbrook532@gmail.com"
                  className="underline decoration-stone-300 underline-offset-4 hover:text-stone-900"
                >
                  tracyholbrook532@gmail.com
                </a>
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
