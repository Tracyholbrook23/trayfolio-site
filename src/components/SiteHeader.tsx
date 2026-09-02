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
          <Link href="/pricing#faq" className="hover:text-stone-900">FAQ</Link>
        </div>
        <Link
          href="/contact"
          className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-light"
        >
          Get in touch
        </Link>
      </nav>
    </header>
  );
}
