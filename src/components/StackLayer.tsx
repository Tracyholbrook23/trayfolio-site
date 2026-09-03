"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type StackLayerProps = {
  children: ReactNode;
  /** Extra classes for the layer itself. Put the background color here. */
  className?: string;
  id?: string;
  /** Render as <footer> instead of <section>. */
  as?: "section" | "footer";
  /**
   * The first layer on the page. It gets no rounded top, no lift, and no
   * shadow, because there is nothing underneath it to overlap.
   */
  first?: boolean;
  /** The last layer on the page. Nothing covers it, so it never sinks. */
  last?: boolean;
  /**
   * Skip the entrance lift. Used by the footer: it sits at the very bottom
   * of the document, so there is not always enough scroll left for the
   * animation to finish, which would leave its content stuck mid-lift.
   */
  noRise?: boolean;
  /**
   * Skip the extra bottom padding that keeps content clear of the next
   * layer riding over it. Used by the hero, which is vertically centered
   * with plenty of empty space at the bottom already.
   */
  noPad?: boolean;
};

/**
 * A single "card" in the scroll stack.
 *
 * Layers are plain siblings with rounded tops and a negative top margin, so
 * each one physically sits on top of the one before it. Two nested wrappers
 * carry the scroll animation so their transforms never fight each other:
 *
 *   rise  - as the layer enters, its content lifts and settles into place
 *   sink  - as the next layer covers it, its content drifts down and shrinks
 *   scrim - a shadow that darkens the layer while it is being covered
 */
export default function StackLayer({
  children,
  className = "",
  id,
  as = "section",
  first = false,
  last = false,
  noRise = false,
  noPad = false,
}: StackLayerProps) {
  const layerRef = useRef<HTMLElement>(null);
  const riseRef = useRef<HTMLDivElement>(null);
  const sinkRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const layer = layerRef.current;
      if (!layer) return;

      // Reduced motion keeps the static overlap (rounded tops, shadow) but
      // drops every scroll-driven transform.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      if (!first && !noRise && riseRef.current) {
        gsap.fromTo(
          riseRef.current,
          { y: 36, scale: 0.975 },
          {
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: layer,
              start: "top bottom",
              end: "top 45%",
              scrub: 0.5,
            },
          }
        );
      }

      if (!last) {
        // Both tweens run over the window where the next layer is sliding
        // over this one: from the moment this layer's bottom edge reaches
        // the bottom of the screen until it is nearly off the top.
        const coveredBy = () => ({
          trigger: layer,
          start: "bottom 88%",
          end: "bottom 12%",
          scrub: 0.5,
        });

        if (sinkRef.current) {
          gsap.fromTo(
            sinkRef.current,
            { y: 0, scale: 1 },
            { y: 44, scale: 0.95, ease: "none", scrollTrigger: coveredBy() }
          );
        }

        if (scrimRef.current) {
          gsap.fromTo(
            scrimRef.current,
            { opacity: 0 },
            { opacity: 0.3, ease: "none", scrollTrigger: coveredBy() }
          );
        }
      }
    },
    { scope: layerRef }
  );

  const Tag = as;

  return (
    <Tag
      ref={layerRef}
      id={id}
      className={[
        "stack-layer",
        first ? "stack-layer--first" : "",
        noPad ? "" : "stack-layer--pad",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div ref={riseRef} className="stack-layer-rise">
        <div ref={sinkRef} className="stack-layer-sink">
          {children}
        </div>
      </div>
      {!last && <div ref={scrimRef} className="stack-layer-scrim" aria-hidden="true" />}
    </Tag>
  );
}
