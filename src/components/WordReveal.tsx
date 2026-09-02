"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * Splits `text` into words, each masked inside an overflow-hidden span, and
 * rises them into place word-by-word as the element scrolls into view.
 * Falls back to a plain, fully-visible render for prefers-reduced-motion.
 */
export default function WordReveal({
  text,
  className = "",
  stagger = 0.05,
  delay = 0,
}: {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const node = ref.current;
      if (!node) return;

      const inner = node.querySelectorAll<HTMLSpanElement>(".reveal-word-inner");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(inner, { y: "0%", opacity: 1 });
        return;
      }

      gsap.fromTo(
        inner,
        { y: "110%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger,
          delay,
          scrollTrigger: {
            trigger: node,
            start: "top 90%",
            once: true,
          },
        }
      );
    },
    { scope: ref, dependencies: [text, stagger, delay] }
  );

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="reveal-word inline-block overflow-hidden align-top">
          <span className="reveal-word-inner inline-block">
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
