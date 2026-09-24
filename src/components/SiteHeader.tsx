import Link from "next/link";

const navigation = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "$50 Demo", href: "/demo" },
  { label: "About", href: "/about" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-900/10 bg-[#fffdf9]/90 backdrop-blur-xl">
      <nav aria-label="Primary navigation" className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-xl font-semibold tracking-[-0.04em]">
          Trayfolio
        </Link>
        <div className="ml-auto hidden items-center gap-7 text-sm font-semibold text-stone-600 md:flex">
          {navigation.map((item) => <Link key={item.href} href={item.href} className="transition hover:text-stone-950">{item.label}</Link>)}
        </div>
        <Link
          href="/book"
          className="ml-auto inline-flex min-h-11 items-center justify-center rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-terracotta-light md:ml-2"
        >
          <span className="sm:hidden">Book a Call</span><span className="hidden sm:inline">Book a Free Call</span>
        </Link>
        <details className="group relative md:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-full border border-stone-300 px-4 text-sm font-semibold marker:hidden">Menu</summary>
          <div className="absolute right-0 top-full z-50 mt-3 grid min-w-64 gap-1 rounded-2xl border border-stone-200 bg-white p-2 text-sm text-stone-800 shadow-2xl">
            {navigation.map((item) => <Link key={item.href} className="rounded-xl px-4 py-3 font-semibold hover:bg-stone-100" href={item.href}>{item.label}</Link>)}
            <Link className="rounded-xl px-4 py-3 font-semibold hover:bg-stone-100" href="/faq">FAQ</Link>
            <Link className="rounded-xl px-4 py-3 font-semibold hover:bg-stone-100" href="/contact">Send an Inquiry</Link>
            <Link className="mt-1 rounded-xl bg-stone-950 px-4 py-3 text-center font-semibold text-white" href="/book">Book a Free Call</Link>
          </div>
        </details>
      </nav>
    </header>
  );
}
