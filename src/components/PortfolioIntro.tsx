"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

const featuredWork = [
  { name: "RunCheck", eyebrow: "Product design · Austin", description: "A bold launch site for a pickup basketball platform built around live local runs.", image: "/work/runcheck.jpg", href: "https://www.theruncheck.app", tone: "portfolio-feature--runcheck" },
  { name: "ATX Auto Detailing", eyebrow: "Service business · Austin", description: "A cinematic, conversion-focused site that brings a mobile detailing service to life.", image: "/work/autodetailingatx.jpg", href: "https://www.autodetailingatx.com", tone: "portfolio-feature--atx" },
  { name: "Valtier Media", eyebrow: "Creative studio · Austin", description: "A polished portfolio for an Austin photography and videography studio built to make every frame feel cinematic.", image: "/work/valtiermedia.jpg", href: "https://www.valtiermedia.com", tone: "portfolio-feature--valtier" },
];

export default function PortfolioIntro() {
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
      <section ref={heroRef} className="portfolio-hero bg-peach text-stone-900">
        <div className="grain-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="portfolio-hero__inner">
          <div ref={heroCopyRef} className="portfolio-hero__copy">
            <p className="portfolio-kicker"><span /> Independent web design studio</p>
            <h1>Websites that make small businesses <em>impossible to ignore.</em></h1>
            <p className="portfolio-hero__lede">Custom strategy, design, and development—from the first idea to a site ready to win customers.</p>
            <div className="portfolio-hero__actions">
              <a href="#featured-work" className="portfolio-button portfolio-button--solid">See the work <span aria-hidden="true">↓</span></a>
              <a href="#demos" className="portfolio-button portfolio-button--text">Try live demos <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div ref={heroVisualRef} className="portfolio-hero__visual" aria-hidden="true">
            {featuredWork.map((project, index) => (
              <figure key={project.name} className={`portfolio-hero__screen portfolio-hero__screen--${index + 1}`}>
                <Image
                  src={project.image}
                  alt=""
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  sizes="(max-width: 767px) 76vw, 48vw"
                />
              </figure>
            ))}
            <span className="portfolio-hero__badge">Real sites · Live now</span>
          </div>
        </div>
        <a className="portfolio-scroll-cue" href="#featured-work"><span aria-hidden="true">↓</span> Scroll through selected work</a>
      </section>

      <section id="featured-work" ref={showcaseRef} className="portfolio-showcase">
        <div className="portfolio-showcase__sticky">
          <div className="portfolio-showcase__heading">
            <p className="portfolio-kicker"><span /> Selected work</p>
            <p>Three businesses. Three completely different digital worlds.</p>
          </div>
          <div className="portfolio-showcase__stage">
            {featuredWork.map((project, index) => (
              <article key={project.name} ref={(node) => { cardRefs.current[index] = node; }} className={`portfolio-feature ${project.tone}`}>
                <div className="portfolio-feature__image">
                  <Image src={project.image} alt={`${project.name} website hero`} fill sizes="(max-width: 767px) 92vw, 78vw" className="object-cover object-top" />
                </div>
                <div className="portfolio-feature__copy">
                  <div><p>{project.eyebrow}</p><h2>{project.name}</h2><span>{project.description}</span></div>
                  <a href={project.href} target="_blank" rel="noopener noreferrer">Visit live site <span aria-hidden="true">↗</span></a>
                </div>
              </article>
            ))}
          </div>
          <Link href="/#work" className="portfolio-showcase__all">Explore all recent work <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  );
}
