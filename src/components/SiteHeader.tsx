import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-peach/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          Trayfolio
        </Link>
        <div className="hidden gap-8 text-sm font-medium text-stone-600 sm:flex">
          <Link href="/#work" className="hover:text-stone-900">Work</Link>
          <Link href="/#demos" className="hover:text-stone-900">Demos</Link>
          <Link href="/pricing" className="hover:text-stone-900">Pricing</Link>
          <Link href="/start" className="hover:text-stone-900">Start</Link>
          <Link href="/faq" className="hover:text-stone-900">FAQ</Link>
        </div>
        <details className="relative ml-auto mr-3 sm:hidden">
          <summary className="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold">Menu</summary>
          <div className="absolute right-0 top-full z-50 mt-3 grid min-w-44 gap-1 rounded-xl border border-stone-200 bg-white p-2 text-sm text-stone-800 shadow-lg">
            <Link className="rounded-lg px-4 py-3 hover:bg-stone-100" href="/#work">Work</Link>
            <Link className="rounded-lg px-4 py-3 hover:bg-stone-100" href="/#demos">Demos</Link>
            <Link className="rounded-lg px-4 py-3 hover:bg-stone-100" href="/pricing">Pricing</Link>
            <Link className="rounded-lg px-4 py-3 hover:bg-stone-100" href="/start">Start a project</Link>
            <Link className="rounded-lg px-4 py-3 hover:bg-stone-100" href="/faq">FAQ</Link>
          </div>
        </details>
        <Link
          href="/contact"
          className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-light"
        >
          <span className="sm:hidden">Contact</span><span className="hidden sm:inline">Get in touch</span>
        </Link>
      </nav>
    </header>
  );
}
