"use client";

import * as React from "react";
import Image from "next/image";
import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import { CompareReveal } from "@/components/ui/compare-reveal";

/**
 * The "template" side: a generic, dated real-estate agent layout, matched
 * to the luxury property reel on the other side so the two panels are the
 * same business told two different ways. Default blue header, stock copy,
 * Arial, a cramped listings row. Nothing here is a copy of any real
 * brokerage site; it's the DIY-template look this section is contrasting
 * against.
 */
function TemplateSitePanel() {
  const listings = [
    {
      price: "$285,000",
      detail: "3 bd  2 ba  1,540 sqft",
      place: "412 Oakwood Dr",
      photo: "/demos/holiday-lighting/gallery/house-1-farmhouse.jpg",
    },
    {
      price: "$349,900",
      detail: "4 bd  3 ba  2,110 sqft",
      place: "88 Ridgeline Ct",
      photo: "/demos/holiday-lighting/gallery/house-4-colonial.jpg",
    },
    {
      price: "$219,000",
      detail: "2 bd  2 ba  1,180 sqft",
      place: "27 Fairview Ave",
      photo: "/demos/holiday-lighting/gallery/house-2-tudor.jpg",
    },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white text-[#333333]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-2.5 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-[#2b4a6b] sm:text-sm">
            Maple Grove Realty
          </p>
          <p className="hidden text-[9px] text-[#777777] sm:block">
            Call today: (555) 014-2288
          </p>
        </div>
        <nav className="hidden gap-4 text-[11px] text-[#444444] sm:flex">
          <span>Home</span>
          <span>About</span>
          <span>Listings</span>
          <span>Contact</span>
        </nav>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-2.5 overflow-hidden px-6 py-8 text-center text-white sm:gap-3">
        {/* The obligatory flat stock house shot behind a plain dark scrim. */}
        <Image
          src="/demos/holiday-lighting/christmas-lights/1-house-before.jpg"
          alt=""
          fill
          aria-hidden="true"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />

        <h3 className="relative text-base font-bold sm:text-2xl">
          Welcome to Maple Grove Realty
        </h3>
        <p className="relative max-w-xs text-[10.5px] text-white/90 sm:text-sm">
          Your trusted local real estate agent since 2004.
        </p>
        <button className="relative rounded-sm bg-white px-3 py-1.5 text-[10.5px] font-semibold text-[#2b4a6b] sm:text-xs">
          Search Homes
        </button>
      </div>

      <div className="border-t border-stone-200 px-3 pb-2 pt-2 sm:px-4">
        <p className="border-b-2 border-[#5b84ad] pb-1 text-[9.5px] font-bold text-[#2b4a6b] sm:text-xs">
          Featured Listings
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {listings.map((listing) => (
            <div key={listing.place} className="border border-stone-200">
              <div className="relative h-7 w-full overflow-hidden bg-stone-200 sm:h-10">
                <Image
                  src={listing.photo}
                  alt=""
                  fill
                  aria-hidden="true"
                  sizes="120px"
                  className="object-cover saturate-[0.75] brightness-95"
                />
              </div>
              <div className="p-1.5">
                <p className="text-[9px] font-bold text-[#2b4a6b] sm:text-[11px]">{listing.price}</p>
                <p className="mt-0.5 truncate text-[7.5px] leading-tight text-[#555555] sm:text-[9px]">
                  {listing.detail}
                </p>
                <p className="truncate text-[7.5px] leading-tight text-[#888888] sm:text-[9px]">
                  {listing.place}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-stone-200 bg-stone-50 px-4 py-2 text-center text-[8.5px] text-stone-400 sm:text-[10px]">
        © 2019 Maple Grove Realty. All rights reserved.
      </div>
    </div>
  );
}

/**
 * The "custom build" side: a single continuous cinematic drone shot
 * (generated with Higgsfield) gliding through the front doors of a luxury
 * home, touring the interior, and gliding back out to the exterior — a
 * real-estate-style hero reel standing in for the kind of custom build
 * Trayfolio delivers. `pointer-events-none` so dragging anywhere on the
 * frame always moves the compare divider instead of interacting with the
 * video.
 */
function PremiumSitePanel() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [showTitle, setShowTitle] = React.useState(false);

  // Pop the title card up over the final beat of the loop — the way a real
  // business site's hero video settles on its wordmark before it repeats.
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const REVEAL_BEFORE_END = 2.4; // seconds of held title before the loop restarts
    const onTimeUpdate = () => {
      if (!video.duration) return;
      setShowTitle(video.currentTime >= video.duration - REVEAL_BEFORE_END);
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  return (
    <div className="pointer-events-none relative h-full w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/hero-previews/luxury-realestate-drone.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />

      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out"
        style={{
          opacity: showTitle ? 1 : 0,
          transform: showTitle ? "translateY(0)" : "translateY(10px)",
        }}
      >
        <span className="font-display text-3xl font-light tracking-[0.02em] text-white sm:text-4xl">
          Elevate Properties
        </span>
      </div>
    </div>
  );
}

export default function SeeTheDifference() {
  return (
    <section id="see-the-difference" className="bg-white">
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
