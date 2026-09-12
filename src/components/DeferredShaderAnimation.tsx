"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ShaderAnimation = dynamic(
  () => import("@/components/ui/shader-animation").then((module) => module.ShaderAnimation),
  { ssr: false },
);

/** Loads the Three.js runtime only when its section is nearly visible. */
export default function DeferredShaderAnimation() {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(boundary);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boundaryRef} className="pointer-events-none absolute inset-0 bg-black" aria-hidden="true">
      {shouldLoad ? <ShaderAnimation /> : null}
    </div>
  );
}
