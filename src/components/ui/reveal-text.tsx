"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RevealTextProps {
  text?: string;
  textColor?: string;
  overlayColor?: string;
  fontSize?: string;
  letterDelay?: number;
  overlayDelay?: number;
  overlayDuration?: number;
  springDuration?: number;
  /** Pause between the orange sweep ending and the photo preview starting. */
  introRevealGap?: number;
  /** Per-letter offset for the photo preview wave. */
  introRevealStagger?: number;
  /** How long each letter holds its photo during the preview. */
  introRevealDuration?: number;
  letterImages?: string[];
  className?: string;
}

// Generic scenic stock photos (Unsplash) used for the per-letter hover
// fill. Swap these for brand photography whenever you have some.
const DEFAULT_LETTER_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
];

/**
 * Letters spring in one-by-one, then a color sweep passes over the whole
 * word. Hovering a letter reveals a background photo clipped to its shape.
 *
 * Adapted for this project: `textColor`/`overlayColor` default to
 * brand-visible colors (the original demo's white-on-red assumed a dark
 * page background — this site's hero is light, so white text would be
 * invisible), and `fontSize` defaults to a responsive scale instead of a
 * single fixed px value so longer words don't overflow on mobile.
 */
export function RevealText({
  text = "STUNNING",
  textColor = "text-stone-900",
  overlayColor = "text-terracotta",
  fontSize = "text-5xl sm:text-7xl md:text-8xl lg:text-[9rem]",
  letterDelay = 0.08,
  overlayDelay = 0.05,
  overlayDuration = 0.4,
  springDuration = 600,
  introRevealGap = 260,
  introRevealStagger = 0.07,
  introRevealDuration = 1.5,
  letterImages = DEFAULT_LETTER_IMAGES,
  className = "",
}: RevealTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showIntroReveal, setShowIntroReveal] = useState(false);

  useEffect(() => {
    // The intro plays itself out in two beats so people see the effect
    // without having to find it, which matters most on touch screens where
    // there is no hover at all:
    //   1. the orange sweep runs across the word
    //   2. each letter briefly shows the photo underneath, then settles
    //      back to solid text until someone hovers it
    const sweepStart = (text.length - 1) * letterDelay * 1000 + springDuration;
    const sweepEnd = sweepStart + (text.length - 1) * overlayDelay * 1000 + overlayDuration * 1000;

    const sweepTimer = setTimeout(() => setShowOverlay(true), sweepStart);

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealTimer = reduceMotion
      ? undefined
      : setTimeout(() => setShowIntroReveal(true), sweepEnd + introRevealGap);

    return () => {
      clearTimeout(sweepTimer);
      if (revealTimer) clearTimeout(revealTimer);
    };
  }, [
    text.length,
    letterDelay,
    springDuration,
    overlayDelay,
    overlayDuration,
    introRevealGap,
  ]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`font-display ${fontSize} relative inline-block cursor-default overflow-hidden font-semibold tracking-tight`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: index * letterDelay,
            type: "spring",
            damping: 8,
            stiffness: 200,
            mass: 0.8,
          }}
        >
          {/* Base text layer */}
          <motion.span
            className={`absolute inset-0 ${textColor}`}
            animate={{ opacity: hoveredIndex === index ? 0 : 1 }}
            transition={{ duration: 0.1 }}
          >
            {letter}
          </motion.span>

          {/* Image text layer, revealed + panned on hover */}
          <motion.span
            className="bg-cover bg-no-repeat bg-clip-text text-transparent"
            animate={{
              opacity: hoveredIndex === index ? 1 : 0,
              backgroundPosition: hoveredIndex === index ? "10% center" : "0% center",
            }}
            transition={{
              opacity: { duration: 0.1 },
              backgroundPosition: { duration: 3, ease: "easeInOut" },
            }}
            style={{
              backgroundImage: `url('${letterImages[index % letterImages.length]}')`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {letter}
          </motion.span>

          {/* One-time color sweep across each letter after the reveal */}
          {showOverlay && (
            <motion.span
              className={`pointer-events-none absolute inset-0 ${overlayColor}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                delay: index * overlayDelay,
                duration: overlayDuration,
                times: [0, 0.1, 0.7, 1],
                ease: "easeInOut",
              }}
            >
              {letter}
            </motion.span>
          )}

          {/* One-time photo preview: the same fill the hover shows, played
              through the word once so the effect announces itself, then
              faded back out to solid text. */}
          {showIntroReveal && (
            <motion.span
              className="pointer-events-none absolute inset-0 bg-cover bg-no-repeat bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                delay: index * introRevealStagger,
                duration: introRevealDuration,
                times: [0, 0.18, 0.6, 1],
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `url('${letterImages[index % letterImages.length]}')`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {letter}
            </motion.span>
          )}
        </motion.span>
      ))}
    </div>
  );
}
