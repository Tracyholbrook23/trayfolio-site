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
    name: "Chill-WIL Air",
    description: "Commercial HVAC & electrician, Austin/DFW",
    image: "/work/chillwilair.jpg",
    href: "https://www.chillwilair.com",
  },
  {
    name: "MØDE",
    description: "Custom membership platform",
    image: "/work/mode.jpg",
    href: "https://www.enterm0de.com",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-white text-zinc-900">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">Trayfolio</span>
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
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-20 sm:pt-28">
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
      </main>

      <footer className="border-t border-zinc-100 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Trayfolio. Built by Tracy Holbrook.
      </footer>
    </div>
  );
}
