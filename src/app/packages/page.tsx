import Link from "next/link";

const buildTiers = [
  {
    name: "Starter",
    price: "$700",
    tagline: "A clean, professional site to get your business online.",
    features: [
      "Up to 4 pages",
      "Mobile-friendly, fast-loading design",
      "Contact form",
      "Basic SEO setup",
      "Launch on your own domain",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    price: "$1,500",
    tagline: "The most popular option for small businesses that want to look established.",
    features: [
      "Up to 8 pages",
      "Custom design around your brand",
      "Photo gallery / portfolio section",
      "Google Business Profile connection",
      "Basic SEO setup",
      "1 round of revisions after launch",
    ],
    highlight: true,
  },
  {
    name: "Signature",
    price: "$3,200",
    tagline: "A larger, fully custom site for businesses that need more.",
    features: [
      "Unlimited pages",
      "Fully custom design & animations",
      "Booking / scheduling integration",
      "Blog or resources section",
      "Advanced SEO setup",
      "2 rounds of revisions after launch",
    ],
    highlight: false,
  },
];

const addOns = [
  {
    name: "Online Booking & Payments",
    price: "+$400",
    description: "Let customers book appointments and pay online, right from your site.",
  },
  {
    name: "Google Business Profile Setup",
    price: "$69",
    description: "One-time setup and optimization so you show up in local search and Maps.",
  },
];

const carePlans = [
  {
    name: "Care",
    price: "$75",
    period: "/mo",
    description: "Keep your site running smoothly after launch.",
    features: [
      "Hosting & domain management",
      "Security & software updates",
      "Uptime monitoring",
      "Up to 30 minutes of edits per month",
    ],
  },
  {
    name: "Care + Content",
    price: "$175",
    period: "/mo",
    description: "Everything in Care, plus ongoing help keeping your site current.",
    features: [
      "Everything in Care",
      "Up to 2 hours of edits per month",
      "Monthly content or photo updates",
      "Priority email support",
    ],
  },
];

const marketing = [
  {
    name: "Social Media Ads",
    price: "$225/mo",
    description: "Management fee plus your ad spend. I set up, run, and report on campaigns across Facebook & Instagram.",
  },
];

const faqs = [
  {
    question: "How long does a project take?",
    answer:
      "Most Starter and Growth sites are live in 1-2 weeks. Signature projects typically take 3-5 weeks depending on scope.",
  },
  {
    question: "How does payment work?",
    answer:
      "Half up front to start the project, half due at launch. Care plans and add-ons are billed monthly once your site is live.",
  },
  {
    question: "Do I own my website?",
    answer:
      "Yes. The site, its content, and your domain are yours. There's no long-term contract to keep your site online.",
  },
  {
    question: "What if I need something not listed here?",
    answer:
      "Every business is different — email me what you're looking for and I'll put together a custom quote.",
  },
];

export default function Packages() {
  return (
    <div className="flex flex-col flex-1 bg-white text-stone-900">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-stone-100 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Trayfolio
          </Link>
          <div className="hidden gap-8 text-sm font-medium text-stone-600 sm:flex">
            <Link href="/#work" className="hover:text-stone-900">
              Work
            </Link>
            <Link href="/#services" className="hover:text-stone-900">
              Services
            </Link>
            <Link href="/packages" className="text-stone-900">
              Packages
            </Link>
            <Link href="/#contact" className="hover:text-stone-900">
              Contact
            </Link>
          </div>
          <a
            href="mailto:tracyholbrook532@gmail.com?subject=Website%20project%20inquiry"
            className="rounded-full bg-gradient-to-r from-terracotta via-gold to-olive px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
          >
            Get in touch
          </a>
        </nav>
      </header>

      <main className="flex-1">
        {/* Header */}
        <section className="mx-auto max-w-5xl px-6 pb-12 pt-16 text-center sm:pt-24">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">
            Packages & pricing
          </p>
          <h1 className="mx-auto max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Flat, upfront pricing. No surprises.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-stone-600">
            Pick the package that fits your business, or email me and we&apos;ll figure out
            what makes sense together.
          </p>
        </section>

        {/* Build tiers */}
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className="grid gap-8 sm:grid-cols-3">
            {buildTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-3xl border p-8 ${
                  tier.highlight
                    ? "border-terracotta bg-stone-950 text-white shadow-xl ring-1 ring-terracotta/40"
                    : "border-stone-200 bg-white"
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-terracotta via-gold to-olive px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="mt-3 text-3xl font-semibold tracking-tight">{tier.price}</p>
                <p
                  className={`mt-3 text-sm leading-6 ${
                    tier.highlight ? "text-stone-300" : "text-stone-600"
                  }`}
                >
                  {tier.tagline}
                </p>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className={tier.highlight ? "text-stone-400" : "text-stone-400"}>
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:tracyholbrook532@gmail.com?subject=${encodeURIComponent(
                    `${tier.name} package inquiry`
                  )}`}
                  className={`mt-8 inline-block rounded-full px-6 py-3 text-center text-sm font-semibold transition ${
                    tier.highlight
                      ? "bg-gradient-to-r from-terracotta via-gold to-olive text-white hover:brightness-110"
                      : "bg-stone-950 text-white hover:bg-stone-800"
                  }`}
                >
                  Get started
                </a>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {addOns.map((addOn) => (
              <div
                key={addOn.name}
                className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-6"
              >
                <div>
                  <h3 className="font-semibold">{addOn.name}</h3>
                  <p className="mt-1 text-sm text-stone-600">{addOn.description}</p>
                </div>
                <span className="whitespace-nowrap text-lg font-semibold text-stone-900">
                  {addOn.price}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Care plans */}
        <section className="border-t border-stone-100 bg-stone-50">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
              After launch
            </h2>
            <p className="mt-2 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Monthly care plans
            </p>
            <p className="mt-3 max-w-xl text-stone-600">
              Optional, cancel anytime. Keep your site fast, secure, and up to date without
              lifting a finger.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {carePlans.map((plan) => (
                <div key={plan.name} className="rounded-2xl border border-stone-200 bg-white p-6">
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="mt-2">
                    <span className="text-2xl font-semibold tracking-tight">{plan.price}</span>
                    <span className="text-sm text-stone-500">{plan.period}</span>
                  </p>
                  <p className="mt-2 text-sm text-stone-600">{plan.description}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="text-stone-400">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Marketing add-ons */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
            Grow your reach
          </h2>
          <p className="mt-2 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
            Marketing add-ons
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {marketing.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-6"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="mt-1 text-sm text-stone-600">{item.description}</p>
                </div>
                <span className="whitespace-nowrap text-lg font-semibold text-stone-900">
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-stone-100 bg-stone-50">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
              Questions
            </h2>
            <p className="mt-2 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Frequently asked
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="rounded-3xl bg-stone-950 px-8 py-14 text-center text-white sm:px-16">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Not sure which package fits?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-stone-300">
              Tell me about your business and I&apos;ll recommend the right option — no
              pressure, no obligation.
            </p>
            <a
              href="mailto:tracyholbrook532@gmail.com?subject=Which%20package%20is%20right%20for%20me%3F"
              className="mt-8 inline-block rounded-full bg-gradient-to-r from-terracotta via-gold to-olive px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Email tracyholbrook532@gmail.com
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-100 py-10 text-sm text-stone-500">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Trayfolio. Built by Tracy Holbrook.</span>
          <div className="flex gap-6">
            <Link href="/#work" className="hover:text-stone-900">
              Work
            </Link>
            <Link href="/#services" className="hover:text-stone-900">
              Services
            </Link>
            <Link href="/packages" className="hover:text-stone-900">
              Packages
            </Link>
            <Link href="/#contact" className="hover:text-stone-900">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
