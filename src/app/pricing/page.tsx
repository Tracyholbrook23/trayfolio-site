import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import LayeredWord from "@/components/LayeredWord";
import DemoCheckoutButton from "@/components/DemoCheckoutButton";

export const metadata: Metadata = {
  alternates: { canonical: "/pricing" },
  title: "Pricing | Trayfolio",
  description:
    "Flat, upfront website pricing for small businesses. Packages from $400, every add-on priced individually, and a $50 demo before you commit.",
};

type Feature = { label: string; highlight?: boolean };

const packages: {
  name: string;
  price: string;
  separately: string;
  save: string;
  blurb: string;
  features: Feature[];
  recommended?: boolean;
}[] = [
  {
    name: "Starter",
    price: "$400",
    separately: "$450",
    save: "$50",
    blurb: "A real site that looks credible and can take messages.",
    features: [
      { label: "Up to 3 pages" },
      { label: "Contact form included" },
      { label: "Built to work properly on phones" },
      { label: "Launch on your own domain" },
    ],
  },
  {
    name: "Growth",
    price: "$600",
    separately: "$675",
    save: "$75",
    blurb: "Double the pages, plus the motion that makes it look expensive.",
    recommended: true,
    features: [
      { label: "Up to 6 pages" },
      { label: "Contact form included" },
      { label: "3D scroll motion included", highlight: true },
      { label: "First month of care free", highlight: true },
    ],
  },
  {
    name: "Signature",
    price: "$1,000",
    separately: "$1,200",
    save: "$200",
    blurb: "Ten pages, and it can actually take money and bookings.",
    features: [
      { label: "Up to 10 pages" },
      { label: "Contact form included" },
      { label: "3D scroll motion included" },
      { label: "Online payments included", highlight: true },
      { label: "Booking and scheduling included", highlight: true },
      { label: "Three months of care free", highlight: true },
    ],
  },
];

const matrix: { row: string; starter: string; growth: string; signature: string }[] = [
  { row: "Pages", starter: "3", growth: "6", signature: "10" },
  { row: "Contact form", starter: "Included", growth: "Included", signature: "Included" },
  { row: "3D scroll motion", starter: "add $75", growth: "Included", signature: "Included" },
  { row: "Online payments", starter: "add $150", growth: "add $150", signature: "Included" },
  { row: "Booking & scheduling", starter: "add $100", growth: "add $100", signature: "Included" },
  { row: "Care plan", starter: "$25/mo", growth: "1st month free", signature: "3 months free" },
];

const addOnGroups: { heading: string; items: { name: string; price: string; note: string }[] }[] = [
  {
    heading: "The build",
    items: [
      { name: "Extra page", price: "$50", note: "Any page past what your package includes." },
      { name: "Contact form", price: "$50", note: "Form, spam protection, delivered to your inbox." },
      { name: "3D scroll motion", price: "$75", note: "Scroll-scrubbed video, pinned sections, layered motion." },
      { name: "Rush delivery", price: "+50%", note: "Live in under a week." },
      { name: "Extra revision round", price: "$50", note: "Past what your build includes." },
    ],
  },
  {
    heading: "Selling and booking",
    items: [
      { name: "Online payments", price: "$150", note: "Take card payments right on your site." },
      { name: "Online store", price: "$300", note: "Product pages, cart, and checkout." },
      { name: "Booking & scheduling", price: "$100", note: "An appointment calendar wired into your site." },
    ],
  },
  {
    heading: "Brand and content",
    items: [
      { name: "Logo & brand basics", price: "$150", note: "Logo, colors, fonts, and a one-page guide." },
      { name: "Copywriting", price: "$40/page", note: "I write the page instead of waiting on you." },
      { name: "Photo sourcing", price: "$50", note: "Photos picked and prepared for your business." },
      { name: "Blog setup", price: "$100", note: "A blog section you can post to yourself." },
      { name: "Custom email", price: "$50", note: "name@yourbusiness.com, set up and working." },
    ],
  },
];

function Cell({ value, highlight = false }: { value: string; highlight?: boolean }) {
  const included = value === "Included" || value.endsWith("free");
  return (
    <td
      className={`px-4 py-3.5 text-center text-sm ${highlight ? "bg-peach/40" : ""} ${
        included ? "font-semibold text-olive" : "text-stone-500"
      }`}
    >
      {value}
    </td>
  );
}

export default function Pricing() {
  return (
    <div className="flex flex-col flex-1 bg-white text-stone-900">
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-[var(--stack-overlap)]">
        {/* Header */}
        <section className="mx-auto max-w-5xl px-6 pb-14 pt-16 sm:pt-24">
          <p className="text-sm font-semibold uppercase tracking-wider text-stone-500">
            Pricing
          </p>
          <h1 className="mt-3">
            <LayeredWord text="Flat Pricing" />
          </h1>
          <Reveal>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
              You see the number before we start, and it does not move. Pick a package
              or build your own from the list below.
            </p>
          </Reveal>
        </section>

        {/* $50 demo, the front door */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <Reveal>
            <div className="flex flex-col gap-6 rounded-3xl border border-terracotta/30 bg-peach px-8 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-12">
              <div className="max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">
                  Start here
                </p>
                <p className="font-display mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  See it before you buy it. $50.
                </p>
                <p className="mt-3 leading-7 text-stone-700">
                  I build you a real landing page for your actual business, live and on a
                  link you can click. Not a mockup. If you go on to buy a site, the $50
                  comes straight off the price.
                </p>
                <p className="mt-3 text-sm text-stone-600">
                  You&apos;ll get your $50 credit code by email straight away, and
                  I&apos;ll be in touch within 24 hours to start building. The demo fee is
                  non-refundable and applies as credit toward a build. It is not a
                  deposit.
                </p>
              </div>
              <DemoCheckoutButton className="shrink-0 self-start sm:self-auto" />
            </div>
          </Reveal>
        </section>

        {/* Packages */}
        <section className="bg-stone-50">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Three packages
              </h2>
              <p className="mt-3 max-w-xl text-stone-600">
                Each one adds pages and one more thing your site can do. Every package
                costs less than buying the same pieces separately.
              </p>
            </Reveal>

            <div className="mt-12 grid items-start gap-8 sm:grid-cols-3">
              {packages.map((pkg, i) => (
                <Reveal key={pkg.name} delay={i * 100}>
                  <div
                    className={`relative flex h-full flex-col border p-8 ${
                      pkg.recommended
                        ? "border-terracotta bg-white shadow-xl ring-1 ring-terracotta/30"
                        : "border-stone-200 bg-white"
                    }`}
                  >
                    {pkg.recommended && (
                      <span className="absolute -top-3 left-8 bg-terracotta px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                        Recommended
                      </span>
                    )}
                    <h3 className="text-lg font-semibold">{pkg.name}</h3>
                    <p className="font-display mt-3 text-4xl font-semibold tracking-tight">
                      {pkg.price}
                    </p>
                    <p className="mt-2 text-sm text-stone-500">
                      <s>{pkg.separately} piece by piece</s>{" "}
                      <span className="font-semibold text-olive">Save {pkg.save}</span>
                    </p>
                    <p className="mt-4 border-t border-stone-200 pt-4 text-sm leading-6 text-stone-600">
                      {pkg.blurb}
                    </p>
                    <ul className="mt-6 flex-1 space-y-3 text-sm">
                      {pkg.features.map((feature) => (
                        <li key={feature.label} className="flex items-start gap-2.5">
                          <span
                            className={feature.highlight ? "text-olive" : "text-terracotta"}
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                          <span>{feature.label}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/start?package=${pkg.name.toLowerCase()}`}
                      className={`mt-8 inline-block px-6 py-3 text-center text-sm font-semibold transition ${
                        pkg.recommended
                          ? "bg-terracotta text-white hover:bg-terracotta-light"
                          : "bg-stone-900 text-white hover:bg-stone-800"
                      }`}
                    >
                      Start with {pkg.name}
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Included or bolted on */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Included, or bolted on
            </h2>
            <p className="mt-3 max-w-xl text-stone-600">
              Any package can reach the same place with add-ons. It just costs more to get
              there.
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10">
            <div className="overflow-x-auto border border-stone-200">
              <table className="w-full min-w-[560px] border-collapse">
                <thead>
                  <tr className="border-b border-stone-300 bg-stone-50">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                      &nbsp;
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-sm font-semibold">
                      Starter
                    </th>
                    <th scope="col" className="bg-peach px-4 py-3 text-center text-sm font-semibold">
                      Growth
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-sm font-semibold">
                      Signature
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((r) => (
                    <tr key={r.row} className="border-b border-stone-200 last:border-b-0">
                      <th scope="row" className="px-4 py-3.5 text-left text-sm font-medium">
                        {r.row}
                      </th>
                      <Cell value={r.starter} />
                      <Cell value={r.growth} highlight />
                      <Cell value={r.signature} />
                    </tr>
                  ))}
                  <tr className="border-t border-stone-300 bg-stone-50">
                    <th scope="row" className="px-4 py-3.5 text-left text-sm font-medium">
                      Piece by piece
                    </th>
                    <td className="px-4 py-3.5 text-center text-sm text-stone-400 line-through">$450</td>
                    <td className="bg-peach/40 px-4 py-3.5 text-center text-sm text-stone-400 line-through">$675</td>
                    <td className="px-4 py-3.5 text-center text-sm text-stone-400 line-through">$1,200</td>
                  </tr>
                  <tr className="bg-stone-50">
                    <th scope="row" className="px-4 py-3.5 text-left text-sm font-medium">
                      Package price
                    </th>
                    <td className="font-display px-4 py-3.5 text-center text-lg font-semibold">$400</td>
                    <td className="font-display bg-peach/40 px-4 py-3.5 text-center text-lg font-semibold">$600</td>
                    <td className="font-display px-4 py-3.5 text-center text-lg font-semibold">$1,000</td>
                  </tr>
                  <tr className="bg-stone-50">
                    <th scope="row" className="px-4 py-3.5 text-left text-sm font-medium">
                      You save
                    </th>
                    <td className="px-4 py-3.5 text-center text-sm font-semibold text-olive">$50</td>
                    <td className="bg-peach/40 px-4 py-3.5 text-center text-sm font-semibold text-olive">$75</td>
                    <td className="px-4 py-3.5 text-center text-sm font-semibold text-olive">$200</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>

        {/* A la carte */}
        <section className="bg-peach">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Build your own
              </h2>
              <p className="mt-3 max-w-xl text-stone-700">
                Every piece, priced on its own. Start from a $400 base site with up to 3
                pages and add only what you need.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-10 sm:grid-cols-3">
              {addOnGroups.map((group, i) => (
                <Reveal key={group.heading} delay={i * 100}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    {group.heading}
                  </h3>
                  <dl className="mt-4 divide-y divide-stone-900/10 border-t border-stone-900/10">
                    {group.items.map((item) => (
                      <div key={item.name} className="py-4">
                        <div className="flex items-baseline justify-between gap-3">
                          <dt className="text-sm font-semibold">{item.name}</dt>
                          <span className="font-display shrink-0 text-sm font-semibold">
                            {item.price}
                          </span>
                        </div>
                        <dd className="mt-1 text-sm leading-6 text-stone-600">{item.note}</dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              ))}
            </div>

            <Reveal delay={300}>
              <p className="mt-10 text-sm text-stone-600">
                Redesigning a site you already have is priced the same as building new.
                Domain and DNS setup is free with every build.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Care plan */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <div className="flex flex-col gap-6 border border-stone-200 px-8 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-12">
              <div className="max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                  After launch
                </p>
                <p className="font-display mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Care plan, $25 a month
                </p>
                <p className="mt-3 leading-7 text-stone-600">
                  Hosting, security updates, uptime monitoring, and small edits when you
                  need them. Optional, month to month, cancel anytime.
                </p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 self-start rounded-full border border-stone-300 px-7 py-3.5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 sm:self-auto"
              >
                Ask about care
              </Link>
            </div>
          </Reveal>
        </section>

        {/* FAQ pointer */}
        <section className="border-t border-stone-100 bg-stone-50">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                Questions
              </h2>
              <p className="mt-2 max-w-lg text-2xl font-semibold tracking-tight sm:text-3xl">
                Timelines, payment, ownership, and what happens after launch.
              </p>
            </div>
            <Link
              href="/faq"
              className="whitespace-nowrap rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Read the FAQ
            </Link>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="rounded-3xl bg-peach px-8 py-14 text-center text-stone-900 sm:px-16">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Not sure which one fits?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-stone-600">
              Tell me about your business and I&apos;ll tell you which package makes sense,
              no pressure and no obligation.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-block rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-terracotta-light"
            >
              Start your project
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
