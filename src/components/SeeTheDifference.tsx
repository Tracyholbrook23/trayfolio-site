"use client";

import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import { CompareReveal } from "@/components/ui/compare-reveal";
import { HeroCarousel, type HeroCarouselItem } from "@/components/ui/hero-carousel";

/**
 * The "template" side: a generic, dated small-business layout — default
 * blue header, stock copy, Arial, a cramped card grid. Nothing here is a
 * copy of any real client site; it's the DIY-template look this section
 * is contrasting against.
 */
function TemplateSitePanel() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white text-[#333333]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-2.5 sm:px-6">
        <span className="text-[13px] font-bold text-[#2b4a6b] sm:text-sm">GreenLeaf Landscaping</span>
        <nav className="hidden gap-4 text-[11px] text-[#444444] sm:flex">
          <span>Home</span>
          <span>About</span>
          <span>Services</span>
          <span>Contact</span>
        </nav>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-2.5 bg-[#5b84ad] px-6 py-8 text-center text-white sm:gap-3">
        <h3 className="text-base font-bold sm:text-2xl">Welcome to GreenLeaf Landscaping</h3>
        <p className="max-w-xs text-[10.5px] text-white/90 sm:text-sm">
          Your trusted lawn care company since 2010.
        </p>
        <button className="rounded-sm bg-white px-3 py-1.5 text-[10.5px] font-semibold text-[#2b4a6b] sm:text-xs">
          Learn More
        </button>
      </div>

      <div className="grid grid-cols-2 gap-px bg-stone-200 text-[9.5px] sm:text-xs">
        <div className="bg-white p-2.5 sm:p-3">
          <p className="border-b-2 border-[#5b84ad] pb-1 font-bold text-[#2b4a6b]">Our Services</p>
          <p className="mt-1.5 leading-snug text-[#555555]">
            Mowing, trimming, and seasonal cleanup for homes and businesses.
          </p>
        </div>
        <div className="bg-white p-2.5 sm:p-3">
          <p className="border-b-2 border-[#5b84ad] pb-1 font-bold text-[#2b4a6b]">Why Choose Us</p>
          <p className="mt-1.5 leading-snug text-[#555555]">
            15+ years experience. Reliable, affordable, on time.
          </p>
        </div>
      </div>

      <div className="border-t border-stone-200 bg-stone-50 px-4 py-2 text-center text-[8.5px] text-stone-400 sm:text-[10px]">
        © 2019 GreenLeaf Landscaping. All rights reserved.
      </div>
    </div>
  );
}

/**
 * The "custom build" side: a moving, autoplaying showcase reel built from
 * real Trayfolio work and demo builds, instead of a static mockup. It sits
 * underneath the compare-reveal's clipped "before" layer and keeps playing
 * on its own — `pointer-events-none` so dragging anywhere on the frame
 * always moves the compare divider rather than fighting the carousel's own
 * drag-to-scroll.
 */
const PREMIUM_LOOKS: HeroCarouselItem[] = [
  {
    title: "Valtier\nMedia",
    image: "/hero-previews/valtier-media.jpg",
    credit: "BUILT BY TRAYFOLIO.",
    meta: ["AUSTIN, TX", "LIVE SITE"],
    effect: "gradient",
  },
  {
    title: "Custom\nMembership",
    image: "/hero-previews/mode-1-gate.jpg",
    credit: "BUILT BY TRAYFOLIO.",
    meta: ["MØDE", "LIVE SITE"],
    // Real captured frames from the live tap-to-enter gate: the landing
    // screen, the tap flash, then the revealed homepage.
    sequence: [
      "/hero-previews/mode-1-gate.jpg",
      "/hero-previews/mode-2-tap.jpg",
      "/hero-previews/mode-3-enter.jpg",
    ],
    sequenceFrameMs: [1300, 450, 1450],
  },
  {
    title: "Shawnie's\nLoc Lab",
    image: "/hero-previews/shawnies-loc-lab.jpg",
    credit: "BUILT BY TRAYFOLIO.",
    meta: ["LANSING, MI", "LIVE SITE"],
  },
  {
    title: "STRUX\nConstruction",
    image: "/hero-previews/strux-construction.jpg",
    credit: "INTERACTIVE DEMO.",
    meta: ["CONSTRUCTION", "SCROLL DEMO"],
    effect: "scroll-scrub",
  },
  {
    title: "Evergreen\nLighting",
    image: "/hero-previews/evergreen-lighting.jpg",
    credit: "INTERACTIVE DEMO.",
    meta: ["HOME SERVICES", "BEFORE/AFTER"],
  },
];

function PremiumSitePanel() {
  return (
    <HeroCarousel
      items={PREMIUM_LOOKS}
      defaultIndex={0}
      brand="TRAYFOLIO"
      autoplay
      autoplayDelay={3200}
      className="pointer-events-none h-full w-full"
    />
  );
}

export default function SeeTheDifference() {
  return (
    <section id="see-the-difference" className="border-t border-stone-100 bg-stone-50">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-stone-500">
            Same business, two different sites
          </p>
          <h2 className="font-display mx-auto mt-2 max-w-xl text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            See the Difference
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-stone-600">
            Drag the divider to compare a generic template site with the kind of custom build
            you get from Trayfolio.
          </p>
        </Reveal>

        <Reveal delay={150} className="mt-10">
          <CompareReveal
            before={<TemplateSitePanel />}
            after={<PremiumSitePanel />}
            labels={["Template", "Trayfolio"]}
            defaultPosition={55}
            introSweep
            snapOnDoubleClick={50}
            className="border-stone-200 shadow-xl shadow-stone-900/10"
            style={
              {
                "--motiq-signature": "#b5541f",
                "--motiq-border": "#e7ded0",
                "--motiq-bg-elevated": "#efe3cb",
              } as CSSProperties
            }
          />
        </Reveal>
      </div>
    </section>
  );
}
