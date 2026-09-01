import Image from "next/image";
import Link from "next/link";

const work = [
  {
    name: "Valtier Media",
    description: "Austin photography & videography studio",
    image: "/work/valtiermedia.jpg",
    href: "https://www.valtiermedia.com",
  },
  {
    name: "MØDE",
    description: "Custom membership platform",
    image: "/work/mode.jpg",
    href: "https://www.enterm0de.com",
  },
  {
    name: "Shawnie's Loc Lab",
    description: "Loc & braid specialist, Lansing MI",
    image: "/work/shawniesloclab.jpg",
    href: "https://www.shawniesloclab.com",
  },
];

const trustBadges = [
  "Flat, upfront pricing",
  "Usually live in 1-2 weeks",
  "You own the site & domain",
  "Direct support from me, not a call center",
];

const services = [
  {
    number: "01",
    title: "Website Creation",
    description:
      "Built around your real business — your services, your photos, your customers — not a template with your logo dropped in.",
  },
  {
    number: "02",
    title: "Website Redesigns",
    description:
      "A modern look and faster load times for a site that's outdated, slow, or doesn't work well on phones.",
  },
  {
    number: "03",
    title: "Care & Support",
    description:
      "Ongoing edits, monitoring, and small changes after launch, billed month to month — cancel anytime.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-white text-zinc-900">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">Trayfolio</span>
          <div className="hidden gap-8 text-sm font-medium text-zinc-600 sm:flex">
            <a href="#work" className="hover:text-zinc-900">Work</a>
            <a href="#services" className="hover:text-zinc-900">Services</a>
            <Link href="/packages" className="hover:text-zinc-900">Packages</Link>
            <a href="#contact" className="hover:text-zinc-900">Contact</a>
          </div>
          <a
            href="mailto:tracyholbrook532@gmail.com?subject=Website%20project%20inquiry"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Get in touch
          </a>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 sm:pt-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Websites for small businesses
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A website your customers trust in the first three seconds.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
            I design and build custom websites for small businesses — fast to load,
            easy to run, and made to turn visitors into customers.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="mailto:tracyholbrook532@gmail.com?subject=Website%20project%20inquiry"
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
            >
              Start your project
            </a>
            <a
              href="#work"
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              See recent work
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-zinc-100 pt-6 text-sm text-zinc-500">
            {trustBadges.map((badge) => (
              <span key={badge} className="flex items-center gap-2">
                <span className="text-zinc-400">✓</span>
                {badge}
              </span>
            ))}
          </div>
        </section>

        {/* Recent work strip */}
        <section id="work" className="border-t border-zinc-100 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Recent work
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {work.map((project) => (
                <Link
                  key={project.name}
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                    <Image
                      src={project.image}
                      alt={`${project.name} website screenshot`}
                      fill
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="mt-1 text-sm text-zinc-600">{project.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            What I actually do
          </h2>
          <p className="mt-2 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
            Three services. No bloat.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {services.map((service) => (
              <div key={service.number}>
                <span className="text-sm font-semibold text-zinc-400">{service.number}</span>
                <h3 className="mt-2 font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Packages teaser */}
        <section className="border-t border-zinc-100 bg-zinc-900 text-white">
          <div className="mx-auto max-w-5xl px-6 py-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Pricing, upfront
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Sites from $700
            </p>
            <p className="mt-3 text-zinc-400">
              No hidden monthly fee if you don&apos;t want one.
            </p>
            <Link
              href="/packages"
              className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
            >
              See full pricing
            </Link>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
          <div className="rounded-3xl bg-zinc-50 px-8 py-14 text-center sm:px-16">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to start your website?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-zinc-600">
              Tell me a bit about your business and what you need, and I&apos;ll follow up to
              set up a time to talk.
            </p>
            <a
              href="mailto:tracyholbrook532@gmail.com?subject=Website%20project%20inquiry"
              className="mt-8 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
            >
              Email tracyholbrook532@gmail.com
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 py-10 text-sm text-zinc-500">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Trayfolio. Built by Tracy Holbrook.</span>
          <div className="flex gap-6">
            <a href="#work" className="hover:text-zinc-900">Work</a>
            <a href="#services" className="hover:text-zinc-900">Services</a>
            <Link href="/packages" className="hover:text-zinc-900">Packages</Link>
            <a href="#contact" className="hover:text-zinc-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
