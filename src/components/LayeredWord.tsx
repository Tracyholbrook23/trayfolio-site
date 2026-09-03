"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * A big display word rendered twice: a hollow outlined copy sitting behind
 * a solid one. The two drift at different rates as the page scrolls, so
 * they separate and close again like two panes at different depths.
 */
export default function LayeredWord({
  text,
  className = "",
  align = "left",
}: {
  text: string;
  className?: string;
  align?: "left" | "center";
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const frontRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const track = {
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      };

      gsap.fromTo(
        ghostRef.current,
        { yPercent: 24, xPercent: -2 },
        { yPercent: -24, xPercent: 2, ease: "none", scrollTrigger: track }
      );

      gsap.fromTo(
        frontRef.current,
        { yPercent: 7 },
        { yPercent: -7, ease: "none", scrollTrigger: { ...track } }
      );
    },
    { scope: wrapRef }
  );

  return (
    <span
      ref={wrapRef}
      className={`layered-word ${align === "center" ? "text-center" : ""} ${className}`}
    >
      <span ref={ghostRef} className="layered-word__ghost" aria-hidden="true">
        {text}
      </span>
      <span ref={frontRef} className="layered-word__front">
        {text}
      </span>
    </span>
  );
}
