# Trayfolio V2 — UX, Information Architecture, Conversion, and Content Blueprint

**Status:** Approved conversion architecture; scheduling provider decision pending
**Basis:** `TRAYFOLIO_V2_AUDIT.md`  
**Scope:** UX and content planning only. This document does not authorize implementation, redesign, route deletion, dependency changes, deployment, or changes to the existing Stripe contract.

## 1. Product Positioning

### Core positioning

Trayfolio is a web design and development studio that creates distinctive, high-quality websites for small businesses nationwide.

The website should communicate three ideas quickly:

1. Trayfolio builds custom websites for small businesses.
2. The work is thoughtful, polished, and tailored—not a generic template with a logo applied.
3. A visitor can either discuss a full project on a free 15-minute call or start with a $50 custom demo delivered within 48 hours.

### Brand role

Trayfolio is the hero brand. Tracy appears as the person behind the work and the person a prospect will speak with, but the site should not read like a résumé or a personal design portfolio.

Recommended voice:

- Confident without hype.
- Clear before clever.
- Warm and direct rather than corporate.
- Specific about process and commitments.
- Visually expressive in project storytelling, restrained in sales copy.

Avoid:

- Agency clichés such as “digital experiences that transform brands.”
- Unsupported performance or revenue claims.
- False scarcity, countdowns, or aggressive sales language.
- “We” language that implies a large team unless that is operationally accurate. Neutral Trayfolio language can avoid overemphasizing either “I” or “we.”
- Public package comparisons or starting prices for custom projects.

## 2. Primary Audiences and Intent

### Audience A — Ready to talk

Likely source: Instagram, referral, repeat visit.  
Primary need: Reach scheduling quickly.  
Required path: Landing page → Book a Free Call → choose phone/video in external scheduler.

The site must not force this visitor to scroll through the portfolio. The booking CTA should be visible in the first mobile viewport and persist in global navigation.

### Audience B — Interested but needs proof

Likely source: social content, search, referral.  
Primary need: Determine whether Trayfolio's quality, style, and process justify a conversation.  
Required path: Hero → selected client work → approach/social proof → call booking.

### Audience C — Not ready for a full project

Primary need: See what Trayfolio could create for their specific business with low commitment.  
Required path: Hero or demo feature → $50 Demo page → Stripe checkout.

### Audience D — Evaluating capabilities

Primary need: Understand services, project fit, process, and breadth of work.  
Required path: Services/Work/About → case study or FAQ → call booking.

### Audience E — Prefers a written inquiry

Primary need: Ask a detailed question, communicate by email, or make contact when no call time works.
Required path: Contact page → concise inquiry form → confirmation with an optional Book a Free Call link.

## 3. Final Information Architecture

### Primary public routes

| Route | Navigation label | Purpose | Primary CTA |
|---|---|---|---|
| `/` | Home | Positioning, strongest proof, story, and both conversion paths | Book a Free Call |
| `/work` | Work | Browse real client work, concepts, and experiments with honest labels | Book a Free Call |
| `/work/[slug]` | Not in primary nav | Immersive in-site case study/project experience | Discuss a Similar Project |
| `/services` | Services | Explain capabilities and fit without package pricing | Book a Free Call |
| `/demo` | $50 Demo | Explain the offer, reduce objections, and start existing Stripe checkout | Get My $50 Demo |
| `/about` | About | Build trust in Trayfolio and briefly introduce Tracy | Book a Free Call |
| `/book` | Book a Call | Dedicated external-scheduler experience for a free 15-minute phone or video call | Book a Free Call |
| `/contact` | Contact | Written inquiry path for detailed questions, email preference, or unavailable call times | Send Inquiry |
| `/faq` | Footer/supporting link | Answer cross-site objections without package pricing | Book a Free Call |
| `/privacy` | Footer | Privacy policy | None |
| `/terms` | Footer | Service and demo terms | None |

The three conversion routes are intentionally distinct: `/book` owns scheduling, `/demo` owns the paid demo path, and `/contact` owns written inquiries. Do not recombine booking and inquiry into one primary experience.

### Transactional and system routes

- Retain `/start/demo-success`, `/start/canceled`, `/api/checkout`, and `/api/stripe/webhook` during V2 implementation.
- Keep dashboard routes and authentication out of public navigation.
- Do not include transactional return routes or dashboard routes in the sitemap.

### Legacy route policy to decide during implementation planning

- `/pricing`: recommended eventual 301/308 redirect to `/services`, not immediate deletion.
- `/start`: recommended removal from public navigation first; eventual redirect to `/book` unless it remains a private/manual project-deposit tool.
- `/start/success`: retain while any project-deposit checkout remains operable.
- Existing demo static URLs: retain to avoid broken portfolio links; continue `noindex` treatment.

These are migration recommendations, not authorization to change the routes now.

## 4. Global Navigation and Wayfinding

### Desktop header

Recommended order:

- Trayfolio wordmark → Home
- Work
- Services
- $50 Demo
- About
- Primary button: **Book a Free Call**

Contact/FAQ do not need equal visual weight in the desktop main navigation. Contact remains available in the footer and mobile menu; FAQ can live in the footer and contextual links.

### Mobile header

The closed state should contain:

- Trayfolio wordmark
- Compact **Book a Call** button
- Menu control

The open menu should contain:

- Work
- Services
- $50 Demo
- About
- Send an Inquiry
- Full-width **Book a Free Call** button

The booking action should remain reachable without opening the menu. The demo offer should be prominent inside the menu but should not compete visually with the primary booking button in the closed header.

### Footer

Recommended columns:

- **Start:** Book a Free Call, Get a $50 Demo, Send an Inquiry
- **Explore:** Work, Services, About, FAQ
- **Social:** Instagram
- **Legal:** Terms, Privacy, Cookie Settings

Footer closing line: “Custom websites for small businesses nationwide.” A restrained “Founded by Tracy Holbrook” line may appear nearby.

## 5. Conversion Strategy

### Conversion hierarchy

1. **Primary:** Book a Free Call
2. **Secondary:** Get a $50 Demo
3. **Fallback:** Send an Inquiry
4. **Exploratory:** View Our Work

These labels should remain consistent across the site. Contextual variations are acceptable, but the underlying action should never be ambiguous.

### Recommended CTA language

Primary default: **Book a Free Call**  
Supporting microcopy: **Free 15-minute phone or video call.**

Secondary default: **Get a $50 Demo**  
Supporting microcopy: **A custom website demo for your business, delivered within 48 hours.**

Tertiary default: **View Selected Work**

Fallback default: **Send an Inquiry**

Avoid “Get started,” “Learn more,” and “Let's talk” as the only label; they conceal what happens next.

### Scheduling integration boundary

The website should provide a stable UI shell for a future external scheduler. It should not define or build scheduling logic.

Recommended `/book` behavior after a provider is chosen:

1. Explain the call in one sentence.
2. Show three facts: free, 15 minutes, phone or video.
3. Present **View Available Times**.
4. Hand off to the external provider in a mobile-friendly way.
5. Keep a clearly visible **Send an Inquiry** link for unavailable times or written communication.

Phone/video selection should occur inside the scheduling provider when supported. Do not make a local selection that can drift from the provider's availability or event configuration.

Before a provider is selected, designs should use a clearly labeled scheduler placeholder/state rather than a fake calendar.

The scheduling event should be free, 15 minutes, and offer attendee choice between phone and video. Intake is limited to name, email, business name, optional current website or Instagram, a short help prompt, meeting type, and a phone number only when needed. Do not ask for budget or a long project questionnaire.

### Scheduling provider recommendation pending approval

Recommend **Cal.com** for Trayfolio's initial scheduling setup. Its individual plan is a strong fit for a one-person studio: unlimited event types and calendar connections, automatic timezone/conflict handling, attendee-selected meeting locations, configurable booking questions, default confirmations, cancellation/rescheduling links, and inline or pop-up embeds. It also preserves a clean path to custom email/SMS workflows if Trayfolio later chooses a paid team plan.

Proposed integration pattern after approval:

1. Create one 15-minute event called **Free Website Call**.
2. Offer two provider-controlled locations: phone and video, with the attendee selecting one.
3. Connect Tracy's working calendar and define availability, notice, buffers, and booking horizon inside Cal.com.
4. Use a full-width inline embed on `/book` with a prominent hosted-scheduler fallback link.
5. Test the inline flow in Safari, Chrome, and Instagram's in-app browser. If the embedded mobile experience proves less reliable, use the hosted Cal.com booking page on small screens without changing the site architecture.
6. Use Cal.com's booking lifecycle for confirmation, cancellation, rescheduling, and reminders. Do not mirror or recreate those records locally.
7. Add privacy-safe provider callbacks only for `booking_started` and `booking_completed`; never forward booking answers or attendee identifiers to analytics.

Free-plan expectation, verified against Cal.com's published plans on September 24, 2026: the core 15-minute booking flow, unlimited event types and connected calendars, locations, timezone handling, standard confirmation, embed, cancellation/rescheduling, and default email/SMS notifications are available to an individual account. Free workflows use Cal.com's default message content. Customizable email/SMS notifications, removal of Cal.com branding, and team features require the Teams plan, currently listed at $12 per user/month when billed annually. SMS reminders consume Cal.com credits, so verify credit cost and availability in the configured account before launch. Start on the free Individual plan; upgrade only if Trayfolio needs branded/custom reminder copy, removed provider branding, or team scheduling.

### $50 demo conversion boundary

The approved demo journey is:

`Get My $50 Demo` → existing `DemoCheckoutButton` behavior → `POST /api/checkout` with `kind=demo` → Stripe-hosted payment → demo intake → intake complete → confirmation → existing fulfillment.

V2 may change presentation, placement, and surrounding copy. It must not plan a new price source, checkout payload, fulfillment service, coupon mechanism, or webhook contract.

The 48-hour delivery clock begins only after Trayfolio receives the required intake information and assets, not when Stripe payment succeeds. The intake connection must not be implemented until the existing checkout, webhook, success page, email, and fulfillment behavior have been traced and a safe extension point is documented.

### Conversion reassurance

Near booking CTAs:

- “Free 15-minute call.”
- “Choose phone or video.”
- “No pressure—just a quick conversation about your business and what the site needs to do.”

Near demo CTAs:

- “$50 one-time payment.”
- “Delivered within 48 hours.”
- “Credited toward your full website if you move forward.”
- Link to terms and privacy before checkout.

Only state “no pressure” or similar language if the actual sales experience will consistently honor it.

## 6. Homepage Experience

### Recommended section order

1. Hero
2. Selected Work
3. Why Trayfolio / Approach
4. $50 Demo
5. Testimonials
6. Process
7. Founder introduction
8. Final dual-path CTA

This keeps the proposed order because it matches the needs of both high-intent and proof-seeking visitors. Immediate conversion is available in the hero; visual evidence follows before Trayfolio explains its philosophy. The demo then appears after visitors have seen the quality they can expect. Testimonials validate the promise, process reduces uncertainty, and founder presence provides a human close without turning the page into a biography.

A small credibility line can sit directly below the hero, but a separate logo strip should not be added unless real, authorized client logos are available.

### 6.1 Hero

**Purpose:** Explain the offer and expose both conversion paths within the first mobile viewport.

Content hierarchy:

- Optional eyebrow: “Web design & development for small businesses”
- One strong H1
- One short supporting statement
- Primary CTA: Book a Free Call
- Secondary CTA: Get a $50 Demo
- Tertiary text link: View Selected Work
- Microcopy beneath actions: “Free 15-minute phone or video call.”

No project screenshot stack, autoplay media, shader, carousel, or scroll lock should appear in the initial viewport. A subtle text reveal or restrained brand accent is sufficient.

#### Hero copy directions

**Recommended direction**

H1: **A better website for the business you're building.**  
Support: **Trayfolio designs and develops custom websites that help small businesses look credible, stand out, and make the next step clear.**

Why it works: It speaks to business ambition, remains plain-English, and avoids unsupported promises.

**Alternative A — more direct**

H1: **Custom websites for small businesses ready to stand out.**  
Support: **Strategy, design, and development in one focused process—from the first conversation to launch.**

**Alternative B — more premium/editorial**

H1: **Your business deserves more than a forgettable website.**  
Support: **Trayfolio creates distinctive digital experiences built around your brand, your customers, and what your business needs next.**

**Alternative C — shortest/mobile-first**

H1: **Websites built to move small businesses forward.**  
Support: **Custom design and development for businesses across the country.**

The final copy should be tested on an actual 320–390px viewport before approval. The primary headline should ideally remain within four short lines on common phones.

### 6.2 Selected Work

**Purpose:** Prove quality immediately after the promise.

Recommended heading: **Built around the business. Never around a template.**  
Intro: One sentence explaining that every project gets its own visual and functional direction.

Show exactly three flagship projects. Each project card/scene should include:

- Honest category label: Client Work
- Project/business name
- Industry
- One-sentence challenge or design objective
- Strong image/video preview
- Primary action: View Case Study
- Secondary action, where appropriate: Visit Live Site

Reuse the current selected-work stacked-card behavior on desktop if it remains smooth and purposeful. On mobile, use a clean vertical editorial sequence rather than reproducing the pinned animation.

### 6.3 Why Trayfolio / Approach

**Purpose:** Translate visual quality into business value and differentiation.

Recommended heading: **A website should feel like your business—not everyone else's.**

Three principles:

1. **Built around your business** — Structure, messaging, and functionality begin with how the business actually works.
2. **Designed to earn trust** — Clear hierarchy, thoughtful details, and a professional experience on every screen.
3. **Made to move people** — Every page should make the visitor's next step obvious, whether that is calling, booking, buying, or visiting.

Optional supporting interaction: The existing “See the Difference” comparator can live here if it adds clarity and performs well. It should be labeled as an illustrative concept, not a client result.

Contextual CTA: **See What Trayfolio Can Do** → Services or Work.

### 6.4 $50 Demo Feature

**Purpose:** Present the demo as a legitimate alternative path, not a small add-on.

Recommended heading: **See your business as a custom website—in 48 hours.**

Recommended body: **For $50, Trayfolio creates a custom website demo around your business. If you choose to move forward with a full website, that $50 is credited toward the project.**

Three-step summary:

1. Pay the $50 demo fee.
2. Share the essentials about your business.
3. Receive a custom demo within 48 hours.

Primary section CTA: **Get My $50 Demo**  
Secondary link: **How the Demo Works** → `/demo`

The section needs a strong visual example of a real demo, clearly labeled “Concept/Demo Work.” Use one of the most complete Trayfolio-hosted demos, not a hover-only experiment.

### 6.5 Testimonials

**Purpose:** Add human credibility after the service and demo promises.

Recommended heading: **What it's like to work with Trayfolio.**

Use two or three real testimonials. Each needs:

- Exact approved quote.
- Person's name.
- Role/business.
- Optional headshot or logo with permission.
- Optional related project link.

Do not invent, rewrite beyond approved light editing, or imply quantified results that are not documented. If testimonials are not ready, omit the section at launch rather than use anonymous or placeholder praise.

### 6.6 Process

**Purpose:** Reduce uncertainty without implying every engagement is identical.

Recommended heading: **Clear from first call to launch.**

Four steps:

1. **Discover** — A free 15-minute conversation about the business, goals, audience, and immediate needs.
2. **Define** — Trayfolio recommends the right scope, timeline, and investment based on the conversation.
3. **Design & Build** — The website takes shape with focused collaboration and review points.
4. **Launch & Support** — Final checks, launch, and agreed support after the site goes live.

Keep pricing out of this section. It should explain when scope and pricing become clear: after discovery, in a written proposal or quote.

### 6.7 Founder Introduction

**Purpose:** Put a trusted person behind the studio without shifting the brand center.

Recommended framing:

Eyebrow: **Behind Trayfolio**  
Heading: **One point of contact from first idea to launch.**  
Body direction: “Trayfolio was founded by Tracy Holbrook to give small businesses a more thoughtful, direct way to get a custom website. You work with the person designing and building the site—without layers of handoffs.”

Include one professional but natural founder image, a short paragraph, and **More About Trayfolio**. Avoid a long biography, skill list, résumé timeline, or oversized portrait on the homepage.

### 6.8 Final CTA

**Purpose:** Restate both paths without forcing a false choice.

Recommended heading: **Ready to give your business a stronger place online?**

- Primary: **Book a Free Call**
- Secondary: **Get a $50 Demo**
- Supporting line: **Not sure which is right? Start with the free 15-minute call.**

## 7. Portfolio and Work Blueprint

### Recommended homepage flagship projects

Based on the current site hierarchy and available assets, the strongest initial candidates are:

1. **RunCheck** — visually distinct product/platform work and a different business category from the service projects.
2. **ATX Auto Detailing** — strong cinematic service-business example that closely matches Trayfolio's target market.
3. **Valtier Media** — polished creative-services portfolio with strong visual media.

These are currently treated as featured work and linked to live domains. Before V2 labels them “Client Work,” verify:

- They are completed/authorized Trayfolio client projects.
- Screenshots and business names can be shown.
- The live domains still represent Trayfolio's work accurately.
- The exact services, challenge, approach, and any outcomes are factual.

If any cannot support a truthful case study, replace it with the strongest verified project among Out of Jersey Creations, MØDE, or Shawnie's Loc Lab.

### Work page taxonomy

The Work page should have three clearly separated groups rather than one mixed grid:

#### Client Work

Potential inventory requiring verification:

- RunCheck
- ATX Auto Detailing
- Valtier Media
- Out of Jersey Creations
- MØDE
- Shawnie's Loc Lab

#### Concept / Demo Work

- STRUX Construction
- Evergreen Holiday Lighting
- Nu2U Moving & Delivery
- Any auto-detailing static demo only if it is distinct from the verified live client project; otherwise avoid duplicate/misleading entries.

#### Interaction Experiments

- Hover Reveal
- Mouse Scrub
- Scroll-Triggered Video
- Other isolated effect studies

Experiments should be presented as a smaller “Lab” or “Interaction Studies” collection, not at the same hierarchy as full client projects.

### Work index structure

1. Intro: custom work across real businesses, concepts, and interaction studies.
2. Featured client work: large editorial cards.
3. More client work: compact but still narrative previews.
4. Concept/demo work: clearly labeled and framed as explorations of industry-specific possibilities.
5. Interaction studies: optional small strip/grid.
6. CTA: Book a call or request a demo.

Filtering is optional. With the current project count, clear grouped sections are easier to understand and require less interaction than filters.

### Case study template

Each `/work/[slug]` should contain only sections supported by real content:

1. **Project hero** — name, category label, industry, concise project statement, key visual.
2. **At a glance** — client/business, services, project type, launch status; no fabricated metrics.
3. **The need** — what the business needed and why.
4. **The approach** — structure, creative direction, and strategic choices.
5. **The experience** — full-width screenshots/video and interaction details.
6. **Functionality** — only meaningful features, described through user/business value.
7. **Outcome** — qualitative or quantitative results only where verified.
8. **Testimonial** — if approved and attributable.
9. **Secondary external link** — Visit Live Site, with new-tab behavior disclosed.
10. **Next project CTA** — “Want something built around your business?”

Concept/demo case studies replace “client,” “need,” and “outcome” with “concept,” “scenario,” and “design exploration.” Interaction experiments explain the behavior and device limitations without implying a client engagement.

## 8. Services Page Blueprint

### Page goal

Help a prospect recognize fit, understand capabilities, and book a conversation. Do not turn the page into a package table.

### Recommended structure

1. **Hero**
   - H1: **Websites shaped around what your business needs next.**
   - Brief scope statement.
   - Book a Free Call CTA.

2. **Core services**
   - Custom website design and development.
   - Website redesigns.
   - E-commerce, payments, and booking integrations where appropriate.
   - Ongoing care and support.

3. **What every project considers**
   - Mobile experience.
   - Clear customer journeys.
   - Performance and accessibility.
   - Search/metadata foundations.
   - Launch and handoff/support.

4. **How scope works**
   - Explain that business needs differ.
   - Scope, timeline, and price follow a short discovery conversation.
   - No vague “contact for pricing” defensiveness; frame conversation as how Trayfolio avoids selling unnecessary features.

5. **Good-fit signals**
   - Small business needs a first professional site.
   - Existing site no longer reflects the business.
   - Mobile experience or conversion path is weak.
   - Business needs payments, booking, lead capture, or a clearer portfolio.

6. **Related work**
   - Two or three projects tied to relevant capabilities.

7. **CTA**
   - Book a Free Call.
   - Secondary $50 Demo option for visitors who want to see an idea first.

Do not promise every listed integration or capability in every engagement. Use “depending on scope” where appropriate.

## 9. $50 Demo Page Blueprint

### Page goal

Make the offer easy to understand, credible, and safe to purchase without confusing it with a complete website project.

### Recommended structure

1. **Hero**
   - H1: **See a custom direction for your business in 48 hours.**
   - Price visibly stated: **$50**.
   - Short explanation and Get My $50 Demo CTA.

2. **What you receive**
   - A custom website demo created around the buyer's actual business.
   - A live link the buyer can review.
   - Clear statement of the intended demo scope once operationally finalized.

3. **How it works**
   - Purchase through Stripe.
   - Trayfolio collects the required business information.
   - Demo delivered within 48 hours.
   - If the buyer proceeds, $50 is credited toward the full project.

4. **Example demo**
   - One strongest complete demo embedded or previewed.
   - Clearly labeled Concept/Demo Work.

5. **What it is / is not**
   - It is a custom demonstration of direction.
   - It is not a complete website or a custom-project deposit.
   - Credit/refund/expiry language must match final Terms and existing fulfillment behavior.

6. **FAQ**
   - What do you need from me?
   - What will I receive?
   - When does the 48-hour clock begin?
   - What happens if I want the full website?
   - Is the $50 refundable?
   - How does the credit work?

7. **Final CTA**
   - Get My $50 Demo.
   - Alternate path: Book a Free Call.

### Required policy decision before copy is final

Define precisely when “within 48 hours” starts: payment time, receipt of intake information, or another event. The safest accurate promise is usually tied to receiving the required business information. That operational definition must match the page, checkout description, terms, confirmation screen, buyer email, and actual fulfillment process.

## 10. About Page Blueprint

### Page goal

Explain why Trayfolio exists, how the studio works, and who the prospect will work with.

### Recommended structure

1. **Brand-first hero** — Trayfolio's purpose and point of view.
2. **Why Trayfolio** — small businesses deserve strategic, distinctive websites without an impersonal agency process.
3. **Founder section** — concise introduction to Tracy, relevant perspective, and working style.
4. **Studio principles** — clarity, craft, responsiveness, honest scope, mobile-first thinking.
5. **Selected proof** — one testimonial or short project montage.
6. **CTA** — Book a Free Call.

Founder content should answer “Who will I work with?” rather than “Here is everything about me.”

## 11. Book and Contact Page Blueprints

### `/book`: Book a Free Call

### Page goal

Give high-intent visitors the shortest possible path to a free 15-minute appointment.

### Recommended structure

1. **Hero**
   - H1: **Let's talk about what your website needs to do.**
   - “Free 15-minute call. Choose phone or video.”

2. **What to expect**
   - Brief discussion of the business and goals.
   - Questions about scope/timing.
   - Clear next step if there is a fit.
   - No preparation beyond basic context.

3. **External scheduler integration area**
   - Provider-controlled availability.
   - Automatic attendee timezone handling.
   - Phone/video choice inside provider.
   - Provider confirmation, approximately 24-hour and 1-hour reminders, and cancellation/rescheduling controls.
   - Loading, error, privacy, and fallback states planned without fake availability.

4. **Written fallback**
   - “Can’t find a time that works? Send an Inquiry.”
   - Link to `/contact`; do not place the full inquiry form beside the calendar.

### `/contact`: Send an Inquiry

### Page goal

Provide a dependable written path for detailed questions, people who prefer email, visitors who cannot find a suitable call time, and people who are not ready to schedule.

### Recommended structure

1. **Hero**
   - H1: **Tell Trayfolio what you’re working on.**
   - Explain that Tracy usually replies within one business day.

2. **Inquiry form**
   - Preserve and evolve the existing `/api/contact` infrastructure.
   - Required: name, email, and concise project message.
   - Optional: phone, business/industry, current website, and project type.
   - Primary submit label: **Send Inquiry**.

3. **Alternative**
   - Secondary link: **Book a Free Call** → `/book`.
   - Keep the direct email address available.

4. **Success state and acknowledgment**
   - Confirm receipt and expected response time.
   - Offer: “Want to talk sooner? Book a Free 15-Minute Call.”
   - Include the same `/book` option in the acknowledgment email.
   - Do not add an “I’d also like to schedule a call” checkbox.

Recommended form project choices:

- New website
- Website redesign
- Online store / payments
- Booking or lead-generation site
- Ongoing website support
- Not sure yet

### Demo intake boundary

The post-purchase intake should be short and clearly separate required from optional information.

Required candidates:

- Business name and contact information.
- What the business offers and its primary product or service.
- Ideal customer.
- Main action website visitors should take.
- Enough approved content or context for Trayfolio to create the demo.

Optional candidates:

- Current website and social links.
- Logo, brand assets, photos, or additional copy.
- Preferred visual direction.
- Inspiration or example sites.
- Anything the customer wants Trayfolio to avoid.

The final required fields, upload/storage method, customer identity handoff, retry behavior, and fulfillment status transition must be decided only after inspecting the existing Stripe demo lifecycle. Payment alone must never mark the intake complete or start the 48-hour clock.

## 12. FAQ Blueprint

Recommended groups:

### Getting started

- Who does Trayfolio work with?
- Do you work with businesses outside your area?
- Can you redesign an existing website?
- What if I am not sure what I need?

### Scope, timing, and pricing

- How much does a website cost?  
  Answer direction: every project is scoped around the business; price and timeline are discussed after the free call and documented before work begins.
- How long does a project take?
- What do I need to provide?
- How do revisions work?

### The $50 demo

- What is included?
- When will it arrive?
- Is it refundable?
- How does the $50 credit work?

### Launch and support

- Do I own my website?
- Can Trayfolio help after launch?
- Can you work with my existing domain or tools?

Answers should stay accurate, concise, and consistent with Terms. Do not publish a numeric custom-project price range unless the business direction changes.

## 13. Content Model Blueprint

### Project record

Recommended fields:

- `slug`
- `name`
- `classification`: client | concept | experiment
- `industry`
- `shortSummary`
- `challenge` or `scenario`
- `approach`
- `designDirection`
- `experienceSummary`
- `services[]`
- `functionality[]`
- `outcome` (optional, verified)
- `testimonial` (optional, approved)
- `coverMedia`
- `gallery[]`
- `previewMedia[]`
- `liveUrl` (optional)
- `liveUrlLabel`
- `featuredOnHome`
- `sortOrder`
- `published`

Classification must drive visible labels and case-study language so concept work can never accidentally render as client work.

### Testimonial record

- Quote exactly as approved.
- Name.
- Role/title.
- Business.
- Related project.
- Image/logo and permission status.
- Approval date/source.

### Global conversion content

Keep a single source for:

- Booking CTA label and reassurance.
- Demo CTA label, price, delivery promise, and credit statement.
- Contact email.
- Social links.

This prevents homepage, footer, demo page, confirmation screen, and email promises from drifting.

### CMS recommendation

Use the existing CMS for copy that Tracy may reasonably update. Keep route structure, classification rules, component selection, layout behavior, Stripe contract details, and validation rules developer-controlled. Do not expose free-form controls that could turn a client project into the wrong classification or break the page hierarchy.

## 14. Visual and Interaction Direction

### Preserve

- Earthy terracotta/peach/olive identity.
- Paper texture as a tactile supporting surface.
- Bold typography and strong editorial scale.
- Selected-work card choreography, coverflow, comparison, and subtle reveal tools where they support meaning.
- Native mobile fallbacks and reduced-motion behavior.

### Refine

- Introduce stronger body-copy contrast from display typography, potentially through a complementary body typeface or lighter text style.
- Use dark sections as intentional dramatic breaks, not the default background for every proof section.
- Limit each page to one primary motion idea plus restrained reveals.
- Avoid simultaneous autoplay, scroll-scrub, video, and shader experiences in adjacent sections.
- Use image/video motion to demonstrate a project, not decorate generic copy.

### Page-level motion rule

Motion should do one of four jobs:

1. Show how a project behaves.
2. Explain a comparison or transformation.
3. Guide attention through a sequence.
4. Reinforce brand character without delaying comprehension.

If it does none of these, it should remain static.

## 15. Mobile-First Requirements

The 320–430px experience is a primary design canvas, not a collapsed desktop layout.

Required first viewport content:

- Trayfolio identity.
- What Trayfolio does.
- Who it serves.
- Book a Free Call.
- Get a $50 Demo.

Mobile requirements:

- Primary actions at least 44px high and easy to distinguish.
- No required horizontal drag to understand core content.
- Case studies read in a natural vertical sequence.
- Videos use posters and do not autoplay with sound.
- Heavy interactions load only near the relevant section.
- No hover-dependent instruction without a touch alternative.
- Scheduler handoff tested in the provider's real mobile flow.
- Sticky/fixed UI must coexist with browser chrome, consent UI, and safe areas.
- Headline wrapping must be reviewed at 320, 360, 375, 390, and 430px widths.

## 16. Trust and Accuracy Rules

- Never label a concept as client work.
- Never publish an outcome, metric, testimonial, or client quote without evidence and approval.
- Clearly state when a live site may have changed since Trayfolio's work.
- Make external/new-tab behavior understandable.
- Keep demo delivery, refund, credit, and expiration statements identical across marketing, Terms, checkout, confirmation, and email.
- Explain that project scope, timeline, and pricing are confirmed after conversation, not hidden arbitrarily.
- Do not imply a team size or service capacity that does not exist.
- Keep direct email and form fallback available when scheduling is unavailable.

## 17. SEO and Measurement Blueprint

### Search intent by page

- Home: custom small-business web design and development nationwide.
- Work: Trayfolio portfolio and small-business website examples.
- Services: custom websites, redesigns, integrations, and support.
- Demo: $50 custom website demo and 48-hour offer.
- About: Trayfolio studio and founder trust.
- Book: free 15-minute website consultation.
- Contact: written website inquiry.
- Case studies: business/industry-specific project stories.

Page titles and descriptions should describe the page accurately rather than repeat one generic site description. Case-study metadata must include the correct classification.

### Conversion events to plan

- `book_call_click` with page/section context.
- `scheduler_view` when the scheduling interface is actually shown.
- `booking_started` when the provider exposes a reliable privacy-safe event.
- `booking_completed` only when the provider exposes a reliable privacy-safe completion callback.
- `inquiry_started` on first meaningful interaction with the inquiry form.
- `inquiry_submitted` after the site receives a successful form response.
- `demo_page_view`.
- `demo_checkout_started` after a valid Stripe checkout URL is returned.
- `demo_purchase_completed` on a verified success path without sending the Stripe session identifier.
- `demo_intake_completed` after required intake is successfully stored and accepted.
- `case_study_view` and optional `live_site_click`.

Attach only controlled context values such as page, section, CTA placement, and device category where useful. Do not send names, email addresses, phone numbers, inquiry contents, booking answers, Stripe session IDs, uploaded asset identifiers, or full destination URLs containing sensitive queries.

### Primary success measures

- Completed bookings, where measurable.
- Demo purchases.
- Qualified inquiry submissions.
- Movement from project previews to case studies and then to booking/demo actions.
- Mobile conversion rate and abandonment compared with desktop.

## 18. Content Needed Before Implementation Can Be Finalized

### Required business decisions

- Scheduling provider.
- Exact phone/video configuration.
- Free versus paid reminder requirements, including whether SMS is necessary at launch.
- Operational definition of the 48-hour demo deadline.
- Demo intake process and precise deliverable boundary.
- Refund, credit-expiry, and revision language confirmed against existing Terms/Stripe behavior.
- Legacy `/pricing` and `/start` policy.

### Required portfolio material

- Verification of which current projects are real client work.
- Permission to use names, logos, quotes, and screenshots.
- Challenge, approach, services, functionality, and truthful outcome for each flagship.
- Current live-site URL and whether it still represents Trayfolio's work.
- High-quality desktop/mobile images or video for each project.

### Required trust content

- Two or three approved client testimonials.
- Concise founder biography.
- Founder photo.
- Accurate nationwide/service-area statement.
- Any credentials or proof points that can be substantiated.

## 19. Approval Checklist Before Implementation

Approve these items explicitly before code changes begin:

1. Approved route map: `/book` for scheduling, `/demo` for the paid demo, and `/contact` for written inquiries.
2. Header/footer navigation.
3. Homepage section order.
4. Hero copy direction.
5. Three verified flagship projects.
6. Work classification for every listed project.
7. Services scope and exclusions.
8. Scheduling provider, plan, embed/handoff method, and call configuration.
9. Final demo promise and policy language.
10. Testimonials and founder content.
11. Legacy pricing/start route behavior.
12. Measurement events and privacy boundaries.

## Final UX Recommendation

Trayfolio V2 should feel simple first and impressive second. The first screen should answer the visitor's practical questions and offer both next steps immediately. The portfolio can then carry the creative weight through a small number of strong, honestly labeled projects. Every later section should reduce a specific uncertainty: why Trayfolio, whether the work is credible, what the $50 demo provides, what working together feels like, and who is behind the studio.

This structure preserves the strongest parts of the existing application while changing its public story from “choose a package” to “see the quality, understand the process, and start the right conversation.”
