export type FieldType = "text" | "textarea" | "email" | "phone" | "url" | "price" | "number" | "select";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  defaultValue: string;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  helpText?: string;
}

export interface SectionDef {
  key: string;
  label: string;
  path: string;
  fields: FieldDef[];
}

const text = (key: string, label: string, defaultValue: string, maxLength = 80): FieldDef =>
  ({ key, label, defaultValue, type: "text", required: true, maxLength });
const textarea = (key: string, label: string, defaultValue: string, maxLength = 300): FieldDef =>
  ({ key, label, defaultValue, type: "textarea", required: true, maxLength });

/**
 * The developer-owned content contract. Clients may change these values,
 * but cannot add fields, rearrange sections, change routes, or touch layout.
 * Defaults keep a new site and dashboard useful before database seeding.
 */
export const contentSchema: SectionDef[] = [
  {
    key: "home", label: "Home page", path: "/", fields: [
      text("heroKicker", "Hero eyebrow", "Independent web design studio", 60),
      text("heroHeading", "Hero heading", "Websites that make small businesses", 70),
      text("heroEmphasis", "Hero emphasized text", "impossible to ignore.", 45),
      textarea("heroLede", "Hero subheading", "Custom strategy, design, and development, from the first idea to a site ready to win customers.", 160),
      text("heroPrimaryCta", "Primary button", "See the work", 30),
      text("heroSecondaryCta", "Secondary button", "Try live demos", 30),
      text("heroBadge", "Hero image badge", "Real sites · Live now", 40),
      text("heroScrollCue", "Scroll prompt", "Scroll through selected work", 45),
      text("workKicker", "Selected work eyebrow", "Selected work", 35),
      textarea("workIntro", "Selected work introduction", "Three businesses. Three completely different digital worlds.", 100),
      text("workAllCta", "All work link", "Explore all recent work", 35),
      text("featured1Eyebrow", "Featured project 1 eyebrow", "Product design · Austin", 60),
      textarea("featured1Description", "Featured project 1 description", "A bold launch site for a pickup basketball platform built around live local runs.", 180),
      text("featured2Eyebrow", "Featured project 2 eyebrow", "Service business · Austin", 60),
      textarea("featured2Description", "Featured project 2 description", "A cinematic, conversion-focused site that brings a mobile detailing service to life.", 180),
      text("featured3Eyebrow", "Featured project 3 eyebrow", "Creative studio · Austin", 60),
      textarea("featured3Description", "Featured project 3 description", "A polished portfolio for an Austin photography and videography studio built to make every frame feel cinematic.", 220),
      text("recentWorkHeading", "Recent work heading", "More Work", 50),
      textarea("recent1Description", "Recent project 1 description", "Custom laser engraving, California", 100),
      textarea("recent2Description", "Recent project 2 description", "Custom membership platform", 100),
      textarea("recent3Description", "Recent project 3 description", "Loc & braid specialist, Lansing MI", 100),
      text("demosHeading", "Live demos heading", "Drag through a few live builds", 70),
      textarea("demosIntro", "Live demos introduction", "Real, interactive demo sites and effects. Drag the cards, then click one to try it for real.", 180),
      text("servicesHeading", "Services heading", "What I Do", 50),
      text("servicesIntro", "Services introduction", "Three services. No bloat.", 80),
      text("service1Title", "Service 1 title", "Website Creation", 60),
      textarea("service1Description", "Service 1 description", "Built around your real business: your services, your photos, your customers, not a template with your logo dropped in.", 240),
      text("service2Title", "Service 2 title", "Website Redesigns", 60),
      textarea("service2Description", "Service 2 description", "A modern look and faster load times for a site that's outdated, slow, or doesn't work well on phones.", 240),
      text("service3Title", "Service 3 title", "Care & Support", 60),
      textarea("service3Description", "Service 3 description", "Ongoing edits, monitoring, and small changes after launch, billed month to month. Cancel anytime.", 240),
      text("brandCtaHeading", "Brand callout heading", "Your Site. Your Way.", 70),
      textarea("brandCtaBody", "Brand callout text", "Built around your business, your brand, and how you actually want to work with a designer. No templates, no hand-offs, no guesswork.", 260),
      text("brandPrimaryCta", "Brand callout primary button", "Let's talk", 30),
      text("brandSecondaryCta", "Brand callout secondary button", "Pricing", 30),
      text("contactEyebrow", "Homepage contact eyebrow", "Let's build something", 50),
      text("contactHeading", "Homepage contact heading", "Ready to start your website?", 70),
      textarea("contactBody", "Homepage contact text", "Tell me a bit about your business and what you need. I read every inquiry myself and usually reply within a business day.", 240),
      text("contactCta", "Homepage contact button", "Start your project", 35),
      text("contactEmailPrompt", "Homepage email prompt", "Prefer email? Reach me at", 60),
      { key: "contactEmail", label: "Homepage contact email", defaultValue: "tracyholbrook532@gmail.com", type: "email", required: true, maxLength: 120 },
    ],
  },
  {
    key: "contact", label: "Contact page", path: "/contact", fields: [
      text("eyebrow", "Page eyebrow", "Let's build something", 45),
      text("heading", "Page heading", "Ready to start your website?", 70),
      textarea("intro", "Introduction", "Tell me a bit about your business and what you need. I read every inquiry myself and usually reply within a business day.", 220),
      { key: "email", label: "Contact email", defaultValue: "tracyholbrook532@gmail.com", type: "email", required: true, maxLength: 120 },
      text("responseTime", "Response time", "Within 1 business day", 50),
    ],
  },
  {
    key: "start", label: "Start page", path: "/start", fields: [
      text("eyebrow", "Page eyebrow", "Start your project", 45),
      text("heading", "Page heading", "Build it, see the price, pay half.", 80),
      textarea("intro", "Introduction", "The number updates as you go, and nothing is hidden. You pay 50% to start and the rest when your site goes live.", 200),
    ],
  },
  {
    key: "pricing", label: "Pricing page", path: "/pricing", fields: [
      text("heading", "Page heading", "Flat Pricing", 60),
      textarea("intro", "Page introduction", "You see the number before we start, and it does not move. Pick a package or build your own from the list below.", 220),
      text("demoEyebrow", "Demo eyebrow", "Start here", 35),
      text("packagesHeading", "Packages heading", "Three packages", 60),
      textarea("packagesIntro", "Packages introduction", "Each one adds pages and one more thing your site can do. Every package costs less than buying the same pieces separately.", 250),
      text("comparisonHeading", "Comparison heading", "Included, or bolted on", 70),
      textarea("comparisonIntro", "Comparison introduction", "Any package can reach the same place with add-ons. It just costs more to get there.", 180),
      text("buildHeading", "Build-your-own heading", "Build your own", 60),
      textarea("redesignNote", "Redesign note", "Redesigning a site you already have is priced the same as building new. Domain and DNS setup is free with every build.", 220),
      textarea("careBody", "Care plan description", "Hosting, security updates, uptime monitoring, and small edits when you need them. Optional, month to month, cancel anytime.", 260),
      text("careCta", "Care plan button", "Ask about care", 30),
      text("faqHeading", "FAQ callout heading", "Timelines, payment, ownership, and what happens after launch.", 100),
      text("faqCta", "FAQ button", "Read the FAQ", 30),
      text("contactHeading", "Contact callout heading", "Not sure which one fits?", 70),
      textarea("contactBody", "Contact callout text", "Tell me about your business and I'll tell you which package makes sense, no pressure and no obligation.", 220),
      text("contactCta", "Contact callout button", "Start your project", 30),
    ],
  },
  {
    key: "faq", label: "FAQ page", path: "/faq", fields: [
      text("heading", "Page heading", "Questions, answered.", 70),
      textarea("intro", "Page introduction", "The things people ask me most before we start. If yours isn't here, just email me and I'll answer it straight.", 200),
      text("gettingStartedHeading", "First group heading", "Getting started", 40),
      text("timelineQuestion", "Timeline question", "How long does a project take?", 100),
      textarea("timelineAnswer", "Timeline answer", "Most Starter and Growth sites are live in 1-2 weeks. Signature projects typically take 3-5 weeks depending on scope.", 350),
      text("redesignQuestion", "Redesign question", "Can you redesign a site I already have?", 100),
      textarea("redesignAnswer", "Redesign answer", "Yes. Redesigns are one of the three things I do. If your current site is outdated, slow, or doesn't work well on phones, I can rebuild it with a modern look and faster load times.", 400),
      text("customQuestion", "Custom work question", "What if I need something not listed here?", 100),
      textarea("customAnswer", "Custom work answer", "Every business is different. Email me what you're looking for and I'll put together a custom quote.", 300),
      text("pricingHeading", "Second group heading", "Pricing & payment", 40),
      text("costQuestion", "Cost question", "How much does a website cost?", 100),
      text("paymentQuestion", "Payment question", "How does payment work?", 100),
      textarea("paymentAnswer", "Payment answer", "Half up front to start the project, half due at launch. Build add-ons are one-time charges included in your project total. Optional care plans are billed monthly once your site is live.", 400),
      text("revisionsQuestion", "Revisions question", "How many rounds of revisions do I get?", 100),
      textarea("revisionsAnswer", "Revisions answer", "Growth includes one round of revisions after launch and Signature includes two. Starter projects are quoted per change if you want edits later, or you can pick up a Care plan for ongoing tweaks.", 400),
      text("afterLaunchHeading", "Third group heading", "After launch", 40),
      text("ownershipQuestion", "Ownership question", "Do I own my website?", 100),
      textarea("ownershipAnswer", "Ownership answer", "Yes. The site, its content, and your domain are yours. There's no long-term contract to keep your site online.", 300),
      text("launchQuestion", "After-launch question", "What happens after my site goes live?", 100),
      textarea("launchAnswer", "After-launch answer", "Nothing you have to do. Care plans are optional and start at $25/mo for hosting, updates, monitoring, and a bit of edit time each month. They're billed month to month and you can cancel anytime.", 400),
      text("ctaHeading", "Callout heading", "Still have a question?", 70),
      textarea("ctaBody", "Callout text", "Ask me directly. I read every message myself and usually reply within a business day.", 220),
      text("contactCta", "Contact button", "Get in touch", 30),
      text("pricingCta", "Pricing button", "See pricing", 30),
    ],
  },
];

export const getSectionDef = (sectionKey: string) =>
  contentSchema.find((section) => section.key === sectionKey);

export const getFieldDef = (sectionKey: string, fieldKey: string) =>
  getSectionDef(sectionKey)?.fields.find((field) => field.key === fieldKey);
