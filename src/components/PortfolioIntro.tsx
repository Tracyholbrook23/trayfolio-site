"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { EditableField } from "@/components/cms/EditableField";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

const featuredWork = [
  { name: "RunCheck", eyebrowKey: "featured1Eyebrow", descriptionKey: "featured1Description", image: "/work/runcheck.jpg", href: "https://www.theruncheck.app", tone: "portfolio-feature--runcheck" },
  { name: "ATX Auto Detailing", eyebrowKey: "featured2Eyebrow", descriptionKey: "featured2Description", image: "/work/autodetailingatx.jpg", href: "https://www.autodetailingatx.com", tone: "portfolio-feature--atx" },
  { name: "Valtier Media", eyebrowKey: "featured3Eyebrow", descriptionKey: "featured3Description", image: "/work/valtiermedia.jpg", href: "https://www.valtiermedia.com", tone: "portfolio-feature--valtier" },
];

export default function PortfolioIntro({
  content,
  editing,
}: {
  content: Record<string, string>;
  editing: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.timeline({ scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 0.6 } })
      .to(heroCopyRef.current, { yPercent: -18, opacity: 0.18, ease: "none" }, 0)
      .to(heroVisualRef.current, { yPercent: 18, scale: 1.08, ease: "none" }, 0);

    const media = gsap.matchMedia();
    media.add("(min-width: 768px)", () => {
      const [first, second, third] = cardRefs.current;
      if (!first || !second || !third) return;
      gsap.set(first, { yPercent: 0, rotate: -1.5, scale: 1, opacity: 1, zIndex: 3 });
      gsap.set(second, { yPercent: 112, rotate: 2.5, scale: 0.92, opacity: 0.45, zIndex: 4 });
      gsap.set(third, { yPercent: 126, rotate: -2, scale: 0.9, opacity: 0.25, zIndex: 5 });
      gsap.timeline({ scrollTrigger: { trigger: showcaseRef.current, start: "top top", end: "bottom bottom", scrub: 0.8 } })
        .to(first, { yPercent: -112, rotate: -4, scale: 0.82, opacity: 0, ease: "none" }, 0)
        .to(second, { yPercent: 0, rotate: 0, scale: 1, opacity: 1, ease: "none" }, 0)
        .to(second, { yPercent: -112, rotate: 4, scale: 0.82, opacity: 0, ease: "none" }, 1)
        .to(third, { yPercent: 0, rotate: 0, scale: 1, opacity: 1, ease: "none" }, 1);
    });
    return () => media.revert();
  }, { scope: rootRef });

  return (
    <div ref={rootRef}>
      <section ref={heroRef} className="paper-texture portfolio-hero text-stone-900">
        <div className="grain-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="portfolio-hero__inner">
          <div ref={heroCopyRef} className="portfolio-hero__copy">
            <p className="portfolio-kicker"><span /> <EditableField as="span" sectionKey="home" fieldKey="heroKicker" label="Hero eyebrow" editing={editing}>{content.heroKicker}</EditableField></p>
            <h1>
              <EditableField as="span" sectionKey="home" fieldKey="heroHeading" label="Hero heading" editing={editing}>{content.heroHeading}</EditableField>{" "}
              <em><EditableField as="span" sectionKey="home" fieldKey="heroEmphasis" label="Hero emphasized text" editing={editing}>{content.heroEmphasis}</EditableField></em>
            </h1>
            <EditableField
              as="p"
              sectionKey="home"
              fieldKey="heroLede"
              label="Hero Subheading"
              editing={editing}
              className="portfolio-hero__lede"
            >
              {content.heroLede}
            </EditableField>
            <div className="portfolio-hero__actions">
              <a href="#featured-work" className="portfolio-button portfolio-button--solid"><EditableField as="span" sectionKey="home" fieldKey="heroPrimaryCta" label="Primary button" editing={editing}>{content.heroPrimaryCta}</EditableField> <span aria-hidden="true">↓</span></a>
              <a href="#demos" className="portfolio-button portfolio-button--text"><EditableField as="span" sectionKey="home" fieldKey="heroSecondaryCta" label="Secondary button" editing={editing}>{content.heroSecondaryCta}</EditableField> <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div ref={heroVisualRef} className="portfolio-hero__visual" aria-hidden="true">
            {featuredWork.map((project, index) => (
              <figure key={project.name} className={`portfolio-hero__screen portfolio-hero__screen--${index + 1}`}>
                <Image
                  src={project.image}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(max-width: 767px) 76vw, 48vw"
                />
              </figure>
            ))}
            <EditableField as="span" sectionKey="home" fieldKey="heroBadge" label="Hero image badge" editing={editing} className="portfolio-hero__badge">{content.heroBadge}</EditableField>
          </div>
        </div>
        <a className="portfolio-scroll-cue" href="#featured-work"><span aria-hidden="true">↓</span> <EditableField as="span" sectionKey="home" fieldKey="heroScrollCue" label="Scroll prompt" editing={editing}>{content.heroScrollCue}</EditableField></a>
      </section>

      <section id="featured-work" ref={showcaseRef} className="portfolio-showcase">
        <div className="portfolio-showcase__sticky">
          <div className="portfolio-showcase__heading">
            <p className="portfolio-kicker"><span /> <EditableField as="span" sectionKey="home" fieldKey="workKicker" label="Selected work eyebrow" editing={editing}>{content.workKicker}</EditableField></p>
            <EditableField as="p" sectionKey="home" fieldKey="workIntro" label="Selected work introduction" editing={editing}>{content.workIntro}</EditableField>
          </div>
          <div className="portfolio-showcase__stage">
            {featuredWork.map((project, index) => (
              <article key={project.name} ref={(node) => { cardRefs.current[index] = node; }} className={`portfolio-feature ${project.tone}`}>
                <div className="portfolio-feature__image">
                  <Image src={project.image} alt={`${project.name} website hero`} fill sizes="(max-width: 767px) 92vw, 78vw" className="object-cover object-top" />
                </div>
                <div className="portfolio-feature__copy">
                  <div>
                    <EditableField as="p" sectionKey="home" fieldKey={project.eyebrowKey} label={`${project.name} eyebrow`} editing={editing}>{content[project.eyebrowKey]}</EditableField>
                    <h2>{project.name}</h2>
                    <EditableField as="span" sectionKey="home" fieldKey={project.descriptionKey} label={`${project.name} description`} editing={editing}>{content[project.descriptionKey]}</EditableField>
                  </div>
                  <a href={project.href} target="_blank" rel="noopener noreferrer">Visit live site <span aria-hidden="true">↗</span></a>
                </div>
              </article>
            ))}
          </div>
          <Link href="/#work" className="portfolio-showcase__all"><EditableField as="span" sectionKey="home" fieldKey="workAllCta" label="All work link" editing={editing}>{content.workAllCta}</EditableField> <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  );
}
