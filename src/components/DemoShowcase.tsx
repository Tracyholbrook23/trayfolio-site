"use client";

import { useState } from "react";

const demos = [
  {
    key: "apparel",
    label: "Apparel & Shopify",
    brand: "Loop Apparel Co.",
    tagline: "Streetwear that ships in two days.",
    cta: "Shop the drop",
    theme: "bg-zinc-950 text-white",
    accent: "from-fuchsia-500 to-orange-400",
  },
  {
    key: "home",
    label: "Home Services & Trades",
    brand: "Sterling Home Services",
    tagline: "Licensed, insured, and on time — every time.",
    cta: "Get a free quote",
    theme: "bg-blue-950 text-white",
    accent: "from-sky-400 to-blue-600",
  },
  {
    key: "sports",
    label: "Sports & Fitness",
    brand: "Momentum Athletics",
    tagline: "Train harder. Recover smarter.",
    cta: "Join the team",
    theme: "bg-zinc-900 text-white",
    accent: "from-lime-400 to-emerald-500",
  },
  {
    key: "photo",
    label: "Photography & Creative",
    brand: "Aperture Studio",
    tagline: "Every moment, framed perfectly.",
    cta: "View the portfolio",
    theme: "bg-neutral-50 text-zinc-900",
    accent: "from-amber-300 to-rose-300",
  },
  {
    key: "more",
    label: "+ Your industry",
    brand: "Your Business",
    tagline: "Whatever you do, it gets its own look — not a leftover template.",
    cta: "Let's talk",
    theme: "bg-zinc-950 text-white",
    accent: "from-violet-500 to-fuchsia-500",
  },
];

export default function DemoShowcase() {
  const [active, setActive] = useState(0);
  const demo = demos[active];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {demos.map((d, i) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              i === active
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-100 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div
          className={`relative flex min-h-[280px] flex-col items-start justify-center gap-4 overflow-hidden px-8 py-14 sm:px-14 ${demo.theme}`}
        >
          <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${demo.accent} opacity-20`} />
          <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
            {demo.brand}
          </span>
          <h3 className="font-display max-w-md text-2xl font-semibold tracking-tight sm:text-3xl">
            {demo.tagline}
          </h3>
          <span
            className={`inline-block rounded-full bg-gradient-to-r px-5 py-2.5 text-sm font-semibold text-zinc-900 ${demo.accent}`}
          >
            {demo.cta}
          </span>
        </div>
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Style concepts shown for illustration — every real project is designed from scratch
        around your brand, not copy-pasted from here.
      </p>
    </div>
  );
}
