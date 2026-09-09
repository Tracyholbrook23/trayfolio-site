import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy | Trayfolio",
  description: "How Trayfolio handles inquiries, payments, website analytics, and your privacy choices.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  ["Who handles your information", "Trayfolio is operated by Tracy Holbrook. This policy covers trayfolio.net and the demo pages hosted on it. For questions or privacy requests, email tracyholbrook532@gmail.com."],
  ["Information you provide", "When you send an inquiry, I receive your name, email address, message, selected project types, and any phone number or business details you choose to provide. When you order a demo or pay a project deposit, Stripe collects payment and billing information and provides order details so I can fulfill your purchase. Please do not put card details, passwords, or other sensitive information in the inquiry form."],
  ["How information is used", "I use inquiry and order information to reply to you, prepare quotes, provide services, send order-related emails, manage payments and demo credits, and resolve support or billing questions. Technical request information, including IP addresses, is also processed to deliver the website and limit abusive requests. Where applicable, these uses support steps you request before a contract, performance of a contract, legal recordkeeping obligations, and the legitimate interests of running and protecting the service."],
  ["Service providers", "Vercel hosts the website. Contact-form submissions are delivered to my inbox through Web3Forms or Resend, depending on the website’s configuration. Stripe processes payments; full card numbers are handled on Stripe’s payment page, not in Trayfolio’s form. Resend sends transactional emails, including demo credit messages, when configured. Email providers also process correspondence. These providers receive the information needed for their respective services and may process it in the United States or other countries under their own terms and privacy practices."],
  ["Analytics and your choice", "If Google Analytics is enabled, it loads only after you select Accept analytics. It measures visits and page usage using browser and device information and analytics cookies. You can reject analytics without losing access to the website, and change your choice using Cookie settings in the footer. Advertising personalization and Google signals are disabled in the website’s analytics configuration. Inquiry text and payment details are not intentionally sent as analytics events."],
  ["Cookies and local storage", "The site saves your analytics choice in your browser’s local storage for six months. This preference storage is used to remember your decision. If accepted, Google Analytics may set cookies beginning with _ga; the website configures their lifetime to six months. Rejecting analytics disables collection through this site and removes accessible first-party analytics cookies. Stripe and external websites may use their own cookies when you visit them."],
  ["Keeping information", "Information is kept for as long as needed to respond to inquiries, deliver and support projects, maintain business and payment records, resolve disputes, and meet applicable legal obligations. The appropriate period depends on the type of record, whether we are working together, and any recordkeeping requirements. Service providers maintain their own records and backups according to their policies."],
  ["Your choices and requests", "You can ask about the information I hold about you and request access, correction, or deletion by emailing me. Depending on where you live and which laws apply, you may also have rights to object to or restrict processing, receive a portable copy, or complain to a data protection authority. I may need to verify your identity before fulfilling a request. Some information may need to be retained for legal obligations or unresolved transactions. Withdrawing analytics consent affects future collection; it does not automatically delete earlier records."],
  ["External links and demos", "Portfolio links may take you to separately operated websites with their own privacy practices. Some hosted demos load fonts, scripts, or images from third-party services; your browser sends technical request information to those services when loading those assets. Demo business names and sample contact details are illustrative; use Trayfolio’s contact page for a real inquiry."],
  ["Changes to this policy", "This page may be updated when the website or its information practices change. The date below identifies the latest revision."],
];

export default function PrivacyPage() {
  return <div className="flex min-h-screen flex-col bg-white text-stone-900">
    <SiteHeader />
    <main id="main-content" className="flex-1 pb-[var(--stack-overlap)]">
      <article className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-stone-600">Last updated September 6, 2026</p>
        <div className="mt-10 space-y-9">
          {sections.map(([title, body]) => <section key={title}><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-stone-700">{body}</p></section>)}
        </div>
        <a href="mailto:tracyholbrook532@gmail.com" className="mt-10 inline-block break-all text-stone-800 underline underline-offset-4">tracyholbrook532@gmail.com</a>
      </article>
    </main>
    <SiteFooter />
  </div>;
}
