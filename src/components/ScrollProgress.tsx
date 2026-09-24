"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const progress = max > 0 ? root.scrollTop / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 h-[3px] w-full">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      />
    </div>
  );
}
