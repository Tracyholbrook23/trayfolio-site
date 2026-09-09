import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { DEMO, formatUSD } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Terms of Service | Trayfolio",
  description: "Terms for Trayfolio website projects, paid demos, deposits, optional care, and using this website.",
  alternates: { canonical: "/terms" },
};

const sections = [
  ["Working with Trayfolio", "Trayfolio is operated by Tracy Holbrook and provides website design, development, and optional ongoing care. These terms explain the services offered through this website. A written project agreement or quote may provide additional terms; the terms specifically agreed for your project take priority if they differ from this page."],
  ["Scope, content, and timing", "The package and add-ons selected at checkout define your initial project scope. Custom requirements, changes, deadlines, and included revisions should be confirmed in writing. Delivery estimates depend on receiving the content, feedback, and access needed to complete the work. Please provide material you own or have permission to use and review your website’s content before launch."],
  ["Project pricing and payments", "Prices are displayed in US dollars. Website projects use a 50% deposit, with the remaining balance due at launch. Build add-ons are one-time charges included in the project total. Additional work outside the agreed scope requires a separate quote. Stripe processes checkout payments; review the amount and order details on its payment page before paying."],
  ["Paid demos", `The ${formatUSD(DEMO.amount)} demo purchases one landing page built for your business and viewable on a live link. The fee is non-refundable and applies as credit toward a later website build; it is not a project deposit. Your credit code is sent by email and can be entered at checkout. This policy does not limit any refund or other rights that cannot be excluded under applicable law.`],
  ["Project cancellations", "If you need to cancel or pause a website project, contact me promptly so we can review its status and the cancellation and refund terms in your written project agreement. The paid-demo policy above applies to demos, not automatically to website project deposits. Any rights that cannot be excluded under applicable law still apply."],
  ["Ownership and third-party services", "Your website, your content, and your domain are yours, subject to the agreed project terms. Third-party fonts, stock assets, software, and integrations remain subject to their respective licenses and service terms. Domain registration, hosting, payment processing, and other third-party services can have their own charges and requirements; your quote identifies what is included."],
  ["Optional care", "Care plans are optional, billed month to month, and can be canceled by contacting me. Included care periods and the ongoing monthly price are shown on the pricing page or in your project agreement. If hosting is provided through a care plan, arrange replacement hosting when ending that service to keep your website online."],
  ["Using this website and its demos", "Do not misuse this website, submit spam, attempt unauthorized access, or interfere with the service. Portfolio and demo pages illustrate design work; sample businesses, sample prices, and demo contact details are not offers from Trayfolio. External websites and services are operated separately. No particular search ranking, visitor count, or sales result is promised by purchasing a website."],
  ["Questions and updates", "For questions about an order, payment, cancellation, or these terms, email tracyholbrook532@gmail.com. This page may be updated for future services; changes do not replace terms already agreed in writing for an existing project."],
];

export default function TermsPage() {
  return <div className="flex min-h-screen flex-col bg-white text-stone-900">
    <SiteHeader />
    <main id="main-content" className="flex-1 pb-[var(--stack-overlap)]">
      <article className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-sm text-stone-600">Last updated September 6, 2026</p>
        <div className="mt-10 space-y-9">{sections.map(([title, body]) => <section key={title}><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-stone-700">{body}</p></section>)}</div>
        <p className="mt-10 leading-7 text-stone-700">See also the <Link className="underline underline-offset-4" href="/privacy">privacy policy</Link> and <Link className="underline underline-offset-4" href="/pricing">current pricing</Link>.</p>
      </article>
    </main>
    <SiteFooter />
  </div>;
}
