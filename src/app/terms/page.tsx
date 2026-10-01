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
  ["Scope, content, and timing", "The written proposal or project agreement defines the website scope, timeline, payment schedule, and included revisions. Delivery estimates depend on receiving the content, feedback, and access needed to complete the work. Please provide material you own or have permission to use and review your website’s content before launch."],
  ["Project pricing and payments", "Custom website pricing is provided directly after Trayfolio understands the project requirements. The proposal or agreement states the project total, payment schedule, and any separately quoted work. Stripe may process online payments; review the amount and order details on its payment page before paying."],
  ["Paid demos", `The ${formatUSD(DEMO.amount)} demo purchases one landing page built for your business and viewable on a live link. The fee is non-refundable and applies as credit toward a later website build; it is not a project deposit. Your credit code is sent by email and can be entered at checkout. This policy does not limit any refund or other rights that cannot be excluded under applicable law.`],
  ["Project cancellations", "If you need to cancel or pause a website project, contact me promptly so we can review its status and the cancellation and refund terms in your written project agreement. The paid-demo policy above applies to demos, not automatically to website project deposits. Any rights that cannot be excluded under applicable law still apply."],
  ["Ownership and third-party services", "Your website, your content, and your domain are yours, subject to the agreed project terms. Third-party fonts, stock assets, software, and integrations remain subject to their respective licenses and service terms. Domain registration, hosting, payment processing, and other third-party services can have their own charges and requirements; your quote identifies what is included."],
  ["Optional care", "Care plans are optional and their services, billing period, and cancellation terms are defined in the project agreement. If hosting is provided through a care plan, arrange replacement hosting when ending that service to keep your website online."],
  ["Text messaging (SMS) terms", "SMS_TERMS"],
  ["Using this website and its demos", "Do not misuse this website, submit spam, attempt unauthorized access, or interfere with the service. Portfolio and demo pages illustrate design work; sample businesses, sample prices, and demo contact details are not offers from Trayfolio. External websites and services are operated separately. No particular search ranking, visitor count, or sales result is promised by purchasing a website."],
  ["Questions and updates", "For questions about an order, payment, cancellation, or these terms, email tracyholbrook532@gmail.com. This page may be updated for future services; changes do not replace terms already agreed in writing for an existing project."],
];

const smsTerms = [
  ["Program", "Trayfolio Customer Messages. When you check the text message box on the Trayfolio contact form, you agree to receive text messages from Trayfolio at the number you provided."],
  ["What we send", "Replies to your inquiry, appointment confirmations and reminders, project updates, and occasional offers related to Trayfolio website services."],
  ["Message frequency", "Message frequency varies based on your inquiry and project."],
  ["Cost", "Message and data rates may apply. Check your mobile plan for details."],
  ["How to opt out", "You can cancel at any time. Reply STOP to any message and you will receive one final message confirming you have been unsubscribed. After that, you will not receive more texts unless you sign up again."],
  ["Help", "Reply HELP for help, or contact Trayfolio at (512) 920-2344 or tracyholbrook532@gmail.com."],
  ["Carriers", "Carriers are not liable for delayed or undelivered messages."],
  ["Consent", "Consent to receive text messages is not a condition of any purchase."],
] as const;

function SmsTerms() {
  return <section id="sms" className="scroll-mt-28">
    <h2 className="text-xl font-semibold">Text messaging (SMS) terms</h2>
    <dl className="mt-3 space-y-3 leading-7 text-stone-700">
      {smsTerms.map(([label, text]) => <div key={label}><dt className="inline font-semibold text-stone-900">{label}: </dt><dd className="inline">{text}</dd></div>)}
    </dl>
    <p className="mt-3 leading-7 text-stone-700">For details on how your information is handled, see the <Link className="underline underline-offset-4" href="/privacy">privacy policy</Link>.</p>
  </section>;
}

export default function TermsPage() {
  return <div className="flex min-h-screen flex-col bg-white text-stone-900">
    <SiteHeader />
    <main id="main-content" className="flex-1 pb-[var(--stack-overlap)]">
      <article className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-sm text-stone-600">Last updated October 1, 2026</p>
        <div className="mt-10 space-y-9">{sections.map(([title, body]) => body === "SMS_TERMS" ? <SmsTerms key={title} /> : <section key={title}><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-stone-700">{body}</p></section>)}</div>
        <p className="mt-10 leading-7 text-stone-700">See also the <Link className="underline underline-offset-4" href="/privacy">privacy policy</Link> and <Link className="underline underline-offset-4" href="/services">services overview</Link>.</p>
      </article>
    </main>
    <SiteFooter />
  </div>;
}
