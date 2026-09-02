"use client";

import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  // When Lenis is active (SmoothScroll), this fires with interpolated
  // scroll progress every frame.
  const lenis = useLenis(({ progress }) => {
    setProgress(progress * 100);
  });

  // If Lenis is disabled (prefers-reduced-motion), fall back to a plain
  // native scroll listener so the bar still works.
  useEffect(() => {
    if (lenis) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      setProgress(max > 0 ? (scrollTop / max) * 100 : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  return (
    <div className="fixed left-0 top-0 z-50 h-[3px] w-full">
      <div
        className="h-full"
        style={{ width: `${progress}%`, backgroundImage: "var(--gradient-brand)" }}
      />
    </div>
  );
}
