"use client"

import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/*
 * Tumble Deck Showcase. A stack of website screenshots standing on edge, one
 * behind the other. The front card tips forward on its bottom edge and lands
 * flat on the floor, the deck slides up to the line, and the next one falls.
 *
 * Adapted for Trayfolio: the deck is driven by normal page scroll. The stage
 * sticks to the viewport while the section scrolls past, so the cards fall as
 * the visitor scrolls and the page carries on once the last card is up front.
 * It never hijacks the wheel, so nobody gets stuck on it.
 *
 * Pure CSS 3D (one perspective, every card hinged on the same floor line) with
 * a single number driving it: the deck position. A small pool of card elements
 * is recycled along it. Slot j always holds the virtual card k = j (mod pool),
 * showing image k mod n, and a slot is only re-pointed while it is invisible.
 */

export type TumbleCard = {
  src: string
  alt?: string
  /** Where clicking the card goes when it is at the front. */
  href?: string
}

export type TumbleDeckShowcaseProps = {
  cards: TumbleCard[]
  /** Card width / height. Images are cropped to it from the top. */
  aspect?: number
  /** Page scroll (px) that tips one card. */
  scrollPerCard?: number
  /** How many upright cards show behind the front one. */
  depth?: number
  /** Space (px) at the top of the stage hidden by the sticky site header. */
  topInset?: number
  /** Called with the index of the card currently at the front. */
  onActiveChange?: (index: number) => void
  /** Rendered inside the sticky stage, above the deck (captions, controls). */
  children?: React.ReactNode
  background?: string
  className?: string
  ariaLabel?: string
}

// #region pose
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Euclidean modulo: card k of an endless deck shows image wrap(k, n). */
export const wrap = (k: number, n: number) => (n ? ((k % n) + n) % n : 0)

/**
 * Hinge angle (deg, CSS rotateX) of a card `t` of the way through its fall.
 * 0 stands upright, -90 lies flat towards the viewer. Gravity eases in, then
 * the card kicks once off the floor and settles.
 */
export function fallAngle(t: number): number {
  const u = clamp01(t)
  const land = 0.78
  if (u <= land) {
    const k = u / land
    return -90 * k * k * k
  }
  const k = (u - land) / (1 - land)
  return -90 + 6 * Math.sin(Math.PI * k) * (1 - k)
}

/** How far the deck has slid forward, in card gaps, at deck position `pos`. */
export function deckAdvance(pos: number): number {
  const i = Math.floor(pos)
  const f = pos - i
  const k = clamp01((f - 0.28) / 0.6)
  return i + k * k * (3 - 2 * k)
}

export type Pose = { angle: number; z: number; lift: number; opacity: number; flat: boolean }

/** Pose of virtual card `k` when the deck is at `pos` (card k is at the front when pos = k). */
export function cardPose(k: number, pos: number, depth: number): Pose {
  const t = pos - k
  const lift = (k - Math.floor(pos) + 3) * 0.6
  if (t >= 1) {
    // On the floor. Only the two latest show.
    return { angle: -90, z: 0, lift, opacity: t < 3 ? 1 : 0, flat: true }
  }
  if (t > 0) return { angle: fallAngle(t), z: 0, lift, opacity: 1, flat: false }
  const rel = k - deckAdvance(pos)
  const opacity = clamp01(depth + 1 - rel)
  return { angle: 0, z: -Math.max(rel, 0), lift: 0, opacity, flat: false }
}
// #endregion

export default function TumbleDeckShowcase({
  cards,
  aspect = 2.3,
  scrollPerCard = 320,
  depth = 5,
  topInset = 64,
  onActiveChange,
  children,
  background = "var(--color-background)",
  className,
  ariaLabel = "Website showcase",
}: TumbleDeckShowcaseProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const stageRef = React.useRef<HTMLDivElement>(null)
  const sceneRef = React.useRef<HTMLDivElement>(null)
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const imgRefs = React.useRef<(HTMLImageElement | null)[]>([])
  const slotK = React.useRef<number[]>([])
  const state = React.useRef({ pos: 0, active: -1 })
  const geo = React.useRef({ h: 200, gap: 44 })
  const activeCb = React.useRef(onActiveChange)
  React.useLayoutEffect(() => {
    activeCb.current = onActiveChange
  }, [onActiveChange])
  const n = cards.length
  // Two on the floor, the falling one, the front one, `depth` behind, one fading in.
  const pool = n ? depth + 5 : 0

  const paint = React.useCallback(() => {
    const { pos } = state.current
    const { gap } = geo.current
    const base = Math.floor(pos) - 2
    cardRefs.current.forEach((el, j) => {
      const img = imgRefs.current[j]
      if (!el || !img || j >= pool) return
      const k = base + wrap(j - base, pool)
      if (slotK.current[j] !== k) {
        slotK.current[j] = k
        const c = cards[wrap(k, n)]
        img.src = c.src
        img.alt = c.alt ?? ""
      }
      const p = cardPose(k, pos, depth)
      el.style.transform = `translate3d(0, ${-p.lift}px, ${p.z * gap}px) rotateX(${p.angle}deg)`
      el.style.opacity = String(p.opacity)
      el.style.visibility = p.opacity > 0 ? "visible" : "hidden"
      const shade = p.flat ? 0.06 : (-p.angle / 90) * 0.06
      el.style.setProperty("--td-shade", String(shade))
    })
    // The card that owns the front is the one that has not started falling yet.
    const active = wrap(Math.round(pos), n)
    if (active !== state.current.active) {
      state.current.active = active
      activeCb.current?.(active)
    }
  }, [depth, pool, cards, n])

  React.useLayoutEffect(() => {
    slotK.current = []
  }, [cards])

  // Fit the card, the deck above it and the floor card below inside the stage.
  React.useLayoutEffect(() => {
    const stage = stageRef.current
    const scene = sceneRef.current
    if (!stage || !scene) return
    const fit = () => {
      const W0 = stage.clientWidth
      const H0 = stage.clientHeight - topInset
      const wFrac = W0 < 640 ? 0.84 : 0.6
      const h = Math.max(60, Math.min((W0 * wFrac) / aspect, H0 * 0.4, 560))
      const w = h * aspect
      const top = topInset + H0 * 0.41 - 0.62 * h
      geo.current = { h, gap: 0.24 * h }
      scene.style.perspective = `${6 * h}px`
      scene.style.perspectiveOrigin = `50% ${top - 1.66 * h}px`
      stage.style.setProperty("--td-w", `${w}px`)
      stage.style.setProperty("--td-h", `${h}px`)
      stage.style.setProperty("--td-top", `${top}px`)
      paint()
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(stage)
    return () => ro.disconnect()
  }, [aspect, topInset, paint])

  // Page scroll drives the deck. Lenis already smooths the scroll and feeds
  // ScrollTrigger, so the deck follows the scroll position directly.
  React.useEffect(() => {
    const section = sectionRef.current
    if (!section || n === 0) return
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        state.current.pos = self.progress * (n - 1)
        paint()
      },
    })
    state.current.pos = st.progress * (n - 1)
    paint()
    return () => st.kill()
  }, [n, paint])

  // Keyboard and the "next" control scroll the page to the next card's spot.
  const scrollToCard = React.useCallback(
    (index: number) => {
      const section = sectionRef.current
      if (!section) return
      const i = Math.max(0, Math.min(n - 1, index))
      const top = section.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top + i * scrollPerCard + 2, behavior: "smooth" })
    },
    [n, scrollPerCard],
  )

  const onKey = (e: React.KeyboardEvent) => {
    const cur = Math.round(state.current.pos)
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      scrollToCard(cur + 1)
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      scrollToCard(cur - 1)
    } else if (e.key === "Enter") {
      const href = cards[wrap(cur, n)]?.href
      if (href) window.location.assign(href)
    }
  }

  const onClick = () => {
    const href = cards[wrap(Math.round(state.current.pos), n)]?.href
    if (href) window.location.assign(href)
  }

  return (
    <div
      ref={sectionRef}
      className={["td-section relative w-full", className].filter(Boolean).join(" ")}
      style={{ height: `calc(100svh + ${Math.max(0, n - 1) * scrollPerCard}px)`, background }}
    >
      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKey}
        className="td-root sticky top-0 h-svh w-full overflow-hidden outline-none select-none"
      >
        <style>{`
          .td-scene { position: absolute; inset: 0; transform-style: preserve-3d; }
          .td-card {
            position: absolute; left: 50%; top: var(--td-top);
            width: var(--td-w); height: var(--td-h); margin-left: calc(var(--td-w) / -2);
            transform-origin: 50% 100%; transform-style: preserve-3d;
            backface-visibility: visible; will-change: transform;
            border-radius: 6px; overflow: hidden; cursor: pointer;
            background: color-mix(in oklab, var(--color-foreground) 8%, var(--color-background));
            box-shadow: 0 0 0 1px color-mix(in oklab, var(--color-foreground) 12%, transparent),
              0 30px 60px -40px rgba(42, 33, 24, 0.55);
          }
          .td-card img {
            display: block; width: 100%; height: 100%; max-width: none;
            object-fit: cover; object-position: 50% 0%; pointer-events: none;
          }
          .td-card::after {
            content: ""; position: absolute; inset: 0; pointer-events: none;
            background: #000; opacity: var(--td-shade, 0);
          }
          .td-root:focus-visible { box-shadow: inset 0 0 0 2px var(--color-ring); }
        `}</style>
        <div ref={sceneRef} className="td-scene" onClick={onClick}>
          {Array.from({ length: pool }, (_, j) => (
            <div
              key={j}
              ref={(el) => {
                cardRefs.current[j] = el
              }}
              className="td-card"
            >
              {/* src/alt are set in paint() as the slot moves along the deck. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={(el) => {
                  imgRefs.current[j] = el
                }}
                alt=""
                width={720}
                height={Math.round(720 / aspect)}
                draggable={false}
                decoding="async"
              />
            </div>
          ))}
        </div>
        {children}
        <span className="sr-only" aria-live="polite">
          {n} projects. Scroll or use the arrow keys to flip through them, and press Enter to open one.
        </span>
      </div>
    </div>
  )
}
