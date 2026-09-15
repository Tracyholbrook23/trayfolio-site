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
import { getSectionContent, getSectionDraftCount } from "@/lib/cms/get-content";
import { getSession } from "@/lib/auth/session";
import { draftMode } from "next/headers";
import { VisualEditorToolbar } from "@/components/cms/VisualEditorToolbar";
import { EditableField } from "@/components/cms/EditableField";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const work = [
  {
    name: "Out of Jersey Creations",
    descriptionKey: "recent1Description",
    image: "/work/outofjerseycreations.jpg",
    href: "https://www.outofjerseycreationshub.com",
  },
  {
    name: "MØDE",
    descriptionKey: "recent2Description",
    image: "/work/mode.jpg",
    href: "https://www.enterm0de.com",
  },
  {
    name: "Shawnie's Loc Lab",
    descriptionKey: "recent3Description",
    image: "/work/shawniesloclab.jpg",
    href: "https://www.shawniesloclab.com",
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
    titleKey: "service1Title",
    descriptionKey: "service1Description",
  },
  {
    number: "02",
    titleKey: "service2Title",
    descriptionKey: "service2Description",
  },
  {
    number: "03",
    titleKey: "service3Title",
    descriptionKey: "service3Description",
  },
];

export default async function Home() {
  const [homeContent, session, draft, draftCount] = await Promise.all([
    getSectionContent("home"),
    getSession(),
    draftMode(),
    getSectionDraftCount("home"),
  ]);

  // Any logged-in dashboard user (owner or client) sees click-to-edit
  // affordances over their own CMS-backed content, see EditableField.
  // This is a UX convenience only, not an access check: every actual
  // write is still independently gated by the Server Action it submits
  // to.
  const editing = Boolean(session.userId && draft.isEnabled);

  return (
    <div className="flex flex-col flex-1 bg-white text-stone-900">
      {session.userId ? <VisualEditorToolbar role={session.role} previewing={draft.isEnabled} draftCount={draftCount} /> : null}
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <PortfolioIntro content={homeContent} editing={editing} />

        {/* The remaining work follows the large selected-work sequence. */}
        <section id="work" className="deferred-render bg-stone-50">
          <div className="mx-auto max-w-5xl px-6 py-24">
            <EditableField as="div" sectionKey="home" fieldKey="recentWorkHeading" label="Recent work heading" editing={editing} value={homeContent.recentWorkHeading}><LayeredWord text={homeContent.recentWorkHeading} /></EditableField>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {work.map((project, i) => (
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
                      <EditableField as="p" sectionKey="home" fieldKey={project.descriptionKey} label={`${project.name} description`} editing={editing} className="mt-1 text-sm text-stone-600">{homeContent[project.descriptionKey]}</EditableField>
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
              <EditableField as="p" sectionKey="home" fieldKey="demosHeading" label="Live demos heading" editing={editing} className="text-center text-sm font-semibold uppercase tracking-wider text-stone-500">{homeContent.demosHeading}</EditableField>
              <EditableField as="p" sectionKey="home" fieldKey="demosIntro" label="Live demos introduction" editing={editing} className="mx-auto mt-1.5 max-w-md text-center text-sm text-stone-600">{homeContent.demosIntro}</EditableField>
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
            <EditableField as="div" sectionKey="home" fieldKey="servicesHeading" label="Services heading" editing={editing} value={homeContent.servicesHeading}><LayeredWord text={homeContent.servicesHeading} /></EditableField>
            <Reveal>
              <EditableField as="p" sectionKey="home" fieldKey="servicesIntro" label="Services introduction" editing={editing} className="mt-6 max-w-xl text-lg text-stone-600">{homeContent.servicesIntro}</EditableField>
            </Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {services.map((service, i) => (
                <Reveal key={service.number} delay={i * 100}>
                  <span className="text-sm font-semibold text-terracotta">{service.number}</span>
                  <EditableField as="div" sectionKey="home" fieldKey={service.titleKey} label={`Service ${i + 1} title`} editing={editing} className="mt-2 font-semibold">{homeContent[service.titleKey]}</EditableField>
                  <EditableField as="p" sectionKey="home" fieldKey={service.descriptionKey} label={`Service ${i + 1} description`} editing={editing} className="mt-2 text-sm leading-6 text-stone-600">{homeContent[service.descriptionKey]}</EditableField>
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
              <EditableField as="div" sectionKey="home" fieldKey="brandCtaHeading" label="Brand callout heading" editing={editing} className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">{homeContent.brandCtaHeading}</EditableField>
              <EditableField as="p" sectionKey="home" fieldKey="brandCtaBody" label="Brand callout text" editing={editing} className="mx-auto mt-6 max-w-xl text-lg text-stone-300">{homeContent.brandCtaBody}</EditableField>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="rounded-full bg-terracotta px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-light"
                >
                  <EditableField as="span" sectionKey="home" fieldKey="brandPrimaryCta" label="Brand callout primary button" editing={editing}>{homeContent.brandPrimaryCta}</EditableField>
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <EditableField as="span" sectionKey="home" fieldKey="brandSecondaryCta" label="Brand callout secondary button" editing={editing}>{homeContent.brandSecondaryCta}</EditableField>
                </Link>
              </div>
            </Reveal>
          </div>
        </StackLayer>

        {/* Contact CTA */}
        <section id="contact" className="deferred-render bg-white">
          <div className="mx-auto max-w-2xl px-6 pt-28 pb-[calc(7rem+var(--stack-overlap))] text-center">
            <Reveal>
              <EditableField as="div" sectionKey="home" fieldKey="contactEyebrow" label="Homepage contact eyebrow" editing={editing} className="text-sm font-semibold uppercase tracking-wider text-stone-500">{homeContent.contactEyebrow}</EditableField>
              <EditableField as="p" sectionKey="home" fieldKey="contactHeading" label="Homepage contact heading" editing={editing} className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{homeContent.contactHeading}</EditableField>
              <EditableField as="p" sectionKey="home" fieldKey="contactBody" label="Homepage contact text" editing={editing} className="mx-auto mt-4 max-w-md text-stone-600">{homeContent.contactBody}</EditableField>
              <Link
                href="/contact"
                className="mt-8 inline-block rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-light"
              >
                <EditableField as="span" sectionKey="home" fieldKey="contactCta" label="Homepage contact button" editing={editing}>{homeContent.contactCta}</EditableField>
              </Link>
              <p className="mt-6 text-sm text-stone-500">
                <EditableField as="span" sectionKey="home" fieldKey="contactEmailPrompt" label="Homepage email prompt" editing={editing}>{homeContent.contactEmailPrompt}</EditableField>{" "}
                <a
                  href={`mailto:${homeContent.contactEmail}`}
                  className="underline decoration-stone-300 underline-offset-4 hover:text-stone-900"
                >
                  <EditableField as="span" sectionKey="home" fieldKey="contactEmail" label="Homepage contact email" editing={editing}>{homeContent.contactEmail}</EditableField>
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
