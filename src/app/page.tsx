import Link from "next/link";

const services = [
  {
    title: "Custom Website Design & Development",
    description:
      "A site built from scratch around your business — fast, mobile-friendly, and easy to update.",
  },
  {
    title: "E-commerce & Online Stores",
    description:
      "Sell products or book services online with a store that's simple for you to manage.",
  },
  {
    title: "Website Redesigns",
    description:
      "Give an outdated or slow site a modern look and better performance without starting from zero.",
  },
  {
    title: "Ongoing Support & Maintenance",
    description:
      "Updates, fixes, and small changes after launch, so your site keeps working as your business grows.",
  },
];

const process = [
  {
    step: "01",
    title: "Discovery call",
    description: "We talk through what your business needs and what success looks like.",
  },
  {
    step: "02",
    title: "Design & build",
    description: "I design and build your site, checking in with you along the way.",
  },
  {
    step: "03",
    title: "Launch & support",
    description: "Your site goes live on your own domain, with support after launch.",
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
            <a href="#services" className="hover:text-zinc-900">Services</a>
            <a href="#work" className="hover:text-zinc-900">Work</a>
            <a href="#process" className="hover:text-zinc-900">Process</a>
            <a href="#contact" className="hover:text-zinc-900">Contact</a>
          </div>
          <Link
            href="#contact"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Get in touch
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-20 sm:pt-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Websites for small businesses
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            I build websites that help your business look as good as the work you do.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
            Trayfolio is a one-person studio helping small businesses get a fast, clean,
            professional website — from first draft to launch, and support after that.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
            >
              Start a project
            </a>
            <a
              href="#work"
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              See past work
            </a>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="border-t border-zinc-100 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Services</h2>
            <p className="mt-3 max-w-xl text-zinc-600">
              Everything you need to get a business online and keep it running.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-2xl border border-zinc-200 bg-white p-6"
                >
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Work / Portfolio placeholder */}
        <section id="work" className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Recent work</h2>
          <p className="mt-3 max-w-xl text-zinc-600">
            A few examples of projects I&apos;ve built. More case studies coming soon.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-400"
              >
                Project screenshot
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section id="process" className="border-t border-zinc-100 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How it works</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {process.map((item) => (
                <div key={item.step}>
                  <span className="text-sm font-semibold text-zinc-400">{item.step}</span>
                  <h3 className="mt-2 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
          <div className="rounded-3xl bg-zinc-900 px-8 py-14 text-center text-white sm:px-16">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to start your website?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-zinc-300">
              Tell me a bit about your business and what you need, and I&apos;ll follow up to
              set up a time to talk.
            </p>
            <a
              href="mailto:tracyholbrook532@gmail.com?subject=Website%20project%20inquiry"
              className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
            >
              Email tracyholbrook532@gmail.com
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Trayfolio. Built by Tracy Holbrook.
      </footer>
    </div>
  );
}
