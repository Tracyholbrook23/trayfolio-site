"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Lives inside <ReactLenis> and wires Lenis's scroll events into GSAP's
 * ticker + ScrollTrigger, so smooth scroll and scroll-scrubbed animations
 * stay in sync instead of drifting against each other.
 */
function LenisScrollTriggerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(ticker);
  }, [lenis]);

  return null;
}

/**
 * Wraps the app in Lenis smooth scrolling. Skips smoothing entirely for
 * users who've asked for reduced motion — they get normal native scroll.
 */
function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  // Lazy initializer: safe to read matchMedia here (no DOM output differs
  // between the two branches below, so there's nothing for SSR hydration
  // to mismatch on) rather than setting state synchronously in an effect.
  const [smoothEnabled, setSmoothEnabled] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setSmoothEnabled(!mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!smoothEnabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.1 }}>
      <LenisScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
