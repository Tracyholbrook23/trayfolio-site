"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      setProgress(max > 0 ? (scrollTop / max) * 100 : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 h-[3px] w-full">
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%`, backgroundImage: "var(--gradient-brand)" }}
      />
    </div>
  );
}
