# Trayfolio V2 — Existing Site Audit and Migration Plan

**Audit date:** September 23, 2026  
**Scope:** Inspection and planning only. No V2 pages, redesigns, route removals, or production-flow changes were made.  
**Source of truth reviewed:** The current repository, including application routes, shared components, CSS, public assets, CMS/dashboard code, contact handling, Stripe checkout and webhook code, metadata, and project configuration.

## Executive Summary

Trayfolio is a working Next.js 16 App Router application, not a disposable brochure site. Its strongest reusable assets are the portfolio interactions, responsive comparison/carousel components, restrained earthy visual system, server-side contact endpoint, consent-aware analytics, SEO foundations, and a complete $50 demo payment/fulfillment flow. It also contains a database-backed content editor with drafts, previews, publishing, version history, rollback, roles, and an audit log.

The main mismatch with V2 is the conversion model. The current site publicly emphasizes fixed packages, add-on prices, a project configurator, and a 50% deposit checkout. V2 should instead establish trust and move custom-project prospects toward a free 15-minute consultation, while retaining the $50 demo as the only public price. The safest path is therefore an evolution inside the existing application: preserve the transactional and content-management systems, create the new information architecture alongside the current routes, migrate the homepage and navigation in phases, and only retire or redirect package-oriented routes after the replacement paths are verified.

Important findings:

- The $50 demo flow is independent enough to preserve intact while the public project-pricing funnel changes.
- The current homepage already contains premium portfolio mechanics worth evolving, but its opening experience is long and visually busy compared with the desired minimal, CTA-first V2 hero.
- There is no dedicated `/work`, `/services`, `/about`, or booking page yet.
- The current demo promise says Tracy will make contact within 24 hours; it does not clearly promise delivery within 48 hours. V2 copy will need one consistent promise across the CTA, checkout description, confirmation page, email, terms, and owner workflow.
- The repository contains about **213 MB** of public assets, of which about **153 MB** is under `public/demos`. Some individual video files are 8–17 MB. These do not all load on the marketing homepage, but they affect repository/deployment weight and need a deliberate media strategy.
- Several unrelated working-tree changes already existed when this audit began (`src/app/globals.css`, `ScrollProgress.tsx`, `SeeTheDifference.tsx`, `coverflow-carousel.tsx`, and `.codex-upload/`). They were not altered by this audit.

## 1. Current Architecture

### Framework and runtime

- Next.js **16.3.4**, React **19.2.8**, TypeScript in strict mode, App Router under `src/app`.
- Tailwind CSS v4 through `@import "tailwindcss"` and inline theme tokens in `src/app/globals.css`.
- Normal server-capable Next.js deployment; there is no static-export configuration.
- The configured production model is GitHub → Vercel, according to the README.
- `next.config.ts` removes the `X-Powered-By` header, adds `nosniff`, a referrer policy, and `SAMEORIGIN`, marks `/demos/*` as `noindex`, and supplies rewrites for selected auto-detailing demo URLs.
- Root-level `src/proxy.ts` protects `/client/dashboard/:path*` with an encrypted iron-session cookie.

### Application layers

1. **Public marketing application**
   - Pages in `src/app`.
   - Shared `SiteHeader`, `SiteFooter`, animation components, portfolio components, and forms.
   - Most marketing copy is database-editable through a field schema, with hardcoded safe defaults.

2. **Static live demos**
   - Exported/self-contained sites and interaction experiments under `public/demos`.
   - Served directly as static files rather than App Router pages.
   - Some demos contain their own bundled Next.js output, media, and fonts.

3. **Content management system**
   - Neon Postgres through `@neondatabase/serverless` and Drizzle ORM.
   - Editable fields are declared in `src/lib/cms/content.schema.ts`.
   - Published values, drafts, versions, users, and audit entries are modeled in `src/lib/db/schema.ts`.
   - Public pages render published content with hardcoded fallbacks; Draft Mode can render unpublished edits in the real page.
   - Dashboard supports per-field editing, section publishing, field history, owner rollback, roles, and activity logging.

4. **Transactional endpoints**
   - `POST /api/contact` validates and relays inquiries through Resend when configured, otherwise Web3Forms.
   - `POST /api/checkout` creates Stripe-hosted Checkout Sessions for either a $50 demo or the current package/deposit flow.
   - `POST /api/stripe/webhook` verifies Stripe signatures and fulfills successful demo/project payments by email.

### Important dependencies

- Motion/UI: GSAP, `@gsap/react`, Framer Motion, Lenis, Three.js, Lucide React.
- Data/security: Drizzle ORM, Neon serverless, iron-session, bcryptjs.
- Styling helpers: Tailwind CSS, `clsx`, `tailwind-merge`.
- Stripe and Resend are called through direct HTTP APIs rather than large client SDKs.

### Code-organization notes

- Page-specific content and arrays are still embedded in some route files, especially pricing and portfolio project definitions.
- Shared components are divided loosely between `src/components` and `src/components/ui`.
- `SmoothScroll.tsx`, `WordReveal.tsx`, and `ui/hero-carousel.tsx` appear to be currently unused. They may be experiments or reusable inventory, but should not be assumed to be active site behavior.
- The checked-in CMS architecture document describes another site and contains stale/proposal language. The implementation in this repository is more advanced than that document suggests; it should not be treated as current Trayfolio documentation.

## 2. Current Page Map

### Public App Router pages

| Route | Current purpose | V2 relevance |
|---|---|---|
| `/` | Portfolio-first homepage with animated hero, selected work, recent work, live demos, comparison, services, brand CTA, and contact CTA | Keep route; restructure content and opening hierarchy |
| `/pricing` | Public fixed packages, feature matrix, add-on prices, care plan, $50 demo CTA, FAQ/contact prompts | Conflicts with V2 custom-pricing direction; demo content is reusable |
| `/start` | Interactive package/add-on builder and 50% project-deposit checkout | Remove from primary public journey; preserve until replacement decisions are final |
| `/start/success` | Project-deposit confirmation and next steps | Preserve while legacy project checkout exists; noindex |
| `/start/demo-success` | $50 demo order confirmation and credit explanation | Preserve and update wording for the finalized 48-hour promise |
| `/start/canceled` | Shared checkout cancellation page, linking back to builder/contact | Preserve initially; eventually distinguish demo cancellation from retired project-builder wording |
| `/contact` | Inquiry page and working inquiry form | Evolve into Book a Call / Contact once scheduler is chosen |
| `/faq` | FAQ grouped around starting, package pricing/payment, and after-launch support | Useful content, but much of the pricing copy conflicts with V2 |
| `/privacy` | Privacy policy covering inquiry, Stripe, Resend/Web3Forms, analytics, and demos | Keep; update when scheduling provider or funnel changes |
| `/terms` | Terms covering fixed packages, deposits, demo credits, care, and demos | Keep legal route; revise before removing package checkout publicly |
| unknown route | Custom 404 page | Keep |

### Protected CMS routes

| Route | Purpose |
|---|---|
| `/client/login` | Email/password dashboard login |
| `/client/dashboard` | Schema-driven list of editable sections and visual editor entry |
| `/client/dashboard/activity` | Owner-only recent audit log |
| `/client/dashboard/[section]` | Generic section editor with draft save, preview, and publish |
| `/client/dashboard/[section]/[field]/history` | Version history and owner rollback for one field |

### API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/contact` | POST | Validate and relay inquiry submissions |
| `/api/checkout` | POST | Create Stripe Checkout Session for demo or project deposit |
| `/api/stripe/webhook` | POST | Verify Stripe webhook and fulfill completed Checkout Sessions |

### Static demo routes/assets

The following user-visible static demo roots exist under `public/demos`:

- `/demos/autodetailing/` plus `/pricing` and `/work` rewrites/pages
- `/demos/construction/`
- `/demos/holiday-lighting/`
- `/demos/image-reveal/`
- `/demos/mouse-scrub/`
- `/demos/nu2u-moving/`
- `/demos/scroll-trigger-video/`

All `/demos/*` responses receive an `X-Robots-Tag: noindex, follow` header. Several are portfolio-grade full sites; others are isolated interaction experiments and should not automatically be presented as equal case studies.

## 3. Current Homepage Map

Current order:

1. **Sticky global header**
   - Trayfolio wordmark.
   - Desktop links: Work, Demos, Pricing, Start a project, FAQ.
   - Mobile `<details>` menu with the same destinations.
   - Persistent Contact/Get in touch CTA.

2. **Portfolio hero (`PortfolioIntro`)**
   - Tall desktop scroll scene (`175vh`) with sticky full-viewport inner layout.
   - Editorial headline, lede, “See the work” and “Try live demos” CTAs.
   - Three overlapping project screenshots and a “Real sites · Live now” badge.
   - Scroll-linked parallax/fade behavior.

3. **Selected work showcase (`PortfolioIntro`)**
   - Dark, `330vh` desktop sticky section.
   - Three full-width project cards (RunCheck, ATX Auto Detailing, Valtier Media) animate through a stacked sequence.
   - Direct external links to live sites.
   - On mobile, this becomes a normal vertical list and disables the desktop card choreography.

4. **More Work**
   - Three-card screenshot grid for Out of Jersey Creations, MØDE, and Shawnie's Loc Lab.
   - Each card links directly to the live site.

5. **Live demos**
   - Interactive 3D coverflow carousel for STRUX, Evergreen Holiday Lighting, Hover Reveal, ATX Auto Detailing, and Nu2U Moving.
   - Autoplay, drag, keyboard, buttons, pagination, and a mobile scrubber.
   - $50 demo pitch and `DemoCheckoutButton`.

6. **See the Difference**
   - Draggable before/after comparison between a deliberately generic real-estate template and a cinematic Trayfolio concept.
   - Premium side contains a lazy, viewport-controlled video.

7. **Services**
   - Three columns: Website Creation, Website Redesigns, Care & Support.
   - Layered heading and reveal animations.

8. **Brand callout**
   - Dark full-width section with deferred Three.js shader background.
   - “Let's talk” and Pricing CTAs.

9. **Contact CTA**
   - Short pitch, contact button, and direct email link.

10. **Footer**
   - Contact, Company, Social, Legal link columns.
   - Cookie settings control when analytics is configured.
   - Animated Trayfolio wordmark reveal.

## 4. Design System

### Typography

- One local display face: **Clash Display Bold**, loaded through `next/font/local` as `--font-clash` with `display: swap`.
- The same bold face is assigned to both sans and display tokens, so nearly all site text uses it. This creates a strong brand voice but limits hierarchy and long-form reading nuance.
- Display treatments use tight tracking and very large fluid sizes, especially the homepage hero and `LayeredWord`.
- Small labels commonly use uppercase text with wide tracking.

### Color palette

- Background peach: `#fbead9`
- Foreground warm brown: `#2a2118`
- Terracotta primary: `#b5541f`
- Terracotta hover token: `#974419` (named “light,” although visually darker)
- Gold: `#c9a227`
- Olive: `#555a3d`
- Olive light: `#9ba37a`
- Sand/muted: `#efe3cb`
- Neutral sections also rely on Tailwind stone colors and near-black custom backgrounds.
- Brand gradient: terracotta → gold → olive.

### Layout and spacing

- Marketing content commonly uses `max-w-5xl` with `px-6` and 5–7rem vertical section padding.
- Contact/start pages expand to `max-w-6xl`; legal pages use `max-w-3xl`.
- Responsive breakpoints lean heavily on Tailwind `sm` and `lg`.
- `StackLayer` creates negative-overlap cards with rounded visual separation, shadow, and scroll-linked rise/sink motion.
- `content-visibility: auto` is applied to many below-the-fold sections with an intrinsic-size fallback.

### Repeated UI patterns

- **Primary button:** terracotta, white label, pill radius, subtle shadow, darker hover.
- **Secondary button:** outlined pill or underlined text.
- **Cards:** white or section-colored surfaces, thin stone borders, occasional rounded 2xl/3xl corners and soft shadows.
- **Paper surface:** peach base plus a full-cover wrinkled paper texture and optional grain overlay.
- **Section headings:** uppercase eyebrow + large display heading, often with reveal or layered-outline animation.

### Design-system assessment

The palette, generous spacing, tactile paper texture, large typography, and restrained button system are coherent and reusable. V2 should formalize them into semantic tokens/components rather than continuing to repeat long Tailwind class strings. A second body font or less-heavy text treatment is worth considering for readability, but that is a design decision rather than an audit requirement.

## 5. Animation & Interaction Inventory

| System | Implementation | Current locations/behavior | Reuse assessment |
|---|---|---|---|
| Portfolio hero parallax | GSAP + ScrollTrigger in `PortfolioIntro.tsx` | Hero copy rises/fades while screenshot stack moves/scales | Evolve; high quality, but too dominant for the desired minimal first screen |
| Selected-work card sequence | GSAP + ScrollTrigger | Three desktop cards animate through a pinned long-scroll scene | Keep/evolve for featured work; mobile already falls back to a vertical list |
| Generic reveal | GSAP + ScrollTrigger in `Reveal.tsx` | Fade/translate once when content reaches 88% viewport | Keep as a shared primitive |
| Layered heading | GSAP + ScrollTrigger in `LayeredWord.tsx` | Solid and outlined text move at different scroll rates | Keep selectively; avoid overuse in CTA-first sections |
| Stacked-section motion | GSAP + ScrollTrigger in `StackLayer.tsx` | Entering layer rises; covered layer sinks/scales; scrim darkens | Evolve; visually distinctive but should not control every V2 section |
| Scroll progress | requestAnimationFrame scroll listener | Fixed 3px brand-gradient bar across top | Optional keep; lightweight and accessible |
| Live-demo coverflow | Custom React animation loop/3D transforms | Auto-rotation, drag inertia, click-through, arrows, keyboard, dots, and mobile scrubber | Strong reusable portfolio primitive |
| Before/after comparison | Custom requestAnimationFrame physics | Pointer drag, keyboard arrows/Home/End, double-click snap, intro sweep | Strong reusable proof/education primitive |
| Premium comparison video | Native video + IntersectionObserver | Starts near viewport, pauses offscreen, reveals title near loop end | Keep with media-budget controls |
| Shader background | Dynamically imported Three.js | Loaded only when within 600px of section | Reuse sparingly; it carries a meaningful JS/GPU cost |
| Footer wordmark reveal | Framer Motion `RevealText` + IntersectionObserver | Starts once footer is in view | Keep if brand direction still fits |
| Consent banner | Stateful React UI | Accept/reject analytics and reopen via footer | Keep |

Reduced-motion support exists across the main GSAP components, carousel/comparison code, CSS animations, and optional smooth-scroll wrapper. `SmoothScroll.tsx` includes a Lenis/ScrollTrigger bridge but is not currently mounted, so the live site uses native scrolling.

Hover behavior includes image zoom/shadow changes, navigation/link color changes, button color/translation, carousel pause, and hover-capability detection for a demo that does not translate to touch. V2 should continue treating hover as enhancement, never as the only way to access information or navigation.

## 6. Existing Portfolio System

There are currently three portfolio tiers:

1. **Featured selected work** — three large animated cards inside the homepage's pinned showcase.
2. **Recent work grid** — three conventional screenshot cards.
3. **Live demo carousel** — five interactive demos/effects that open Trayfolio-hosted demo experiences.

Project definitions are hardcoded arrays inside `src/components/PortfolioIntro.tsx` and `src/app/page.tsx`; there is no shared project content model or `/work` route. Images use `next/image` on the marketing page. Featured/live-client projects currently send visitors off-site, while demo projects keep visitors inside Trayfolio.

Especially reusable pieces:

- The large project-card presentation and desktop/mobile bifurcation in `PortfolioIntro`.
- The coverflow carousel's pointer, keyboard, mobile scrubber, responsive measurement, captions, and device-specific hints.
- The portfolio screenshot library in `public/work` and preview media in `public/hero-previews`.
- Full Trayfolio-hosted demo experiences for construction, holiday lighting, auto detailing, and moving/delivery.
- The “See the Difference” comparison as a supporting proof mechanism.

What V2 needs:

- A canonical project data model shared by Home and Work.
- A dedicated `/work` index.
- In-site project/case-study routes or rich previews so Trayfolio remains the primary experience.
- Clear labeling between real client work, concept demos, and isolated effect experiments.
- Project metadata such as client/business, industry, challenge, approach, outcomes, services, credits, live-site availability, and media.
- A strategy for preserving live-client links as a secondary action rather than the primary experience.

## 7. $50 Demo + Stripe Flow

### End-to-end flow

1. A visitor clicks `DemoCheckoutButton`, currently rendered on the homepage demo section and `/pricing`.
2. The client component posts JSON `{ "kind": "demo" }` to `POST /api/checkout`.
3. The checkout route:
   - Requires `STRIPE_SECRET_KEY` server-side.
   - Applies a basic per-instance IP rate limit.
   - Enforces same-origin/cross-site and JSON/body-size checks through `readSubmission`.
   - Uses the server-owned `DEMO` catalog entry (`5000` cents), so the browser cannot choose the amount.
   - Creates a Stripe-hosted one-time payment Session.
   - Sets metadata `kind=demo`.
   - Uses `/start/demo-success` as the success URL and `/start/canceled` as the cancel URL.
   - Returns the Stripe URL; the browser navigates there.
4. Stripe hosts the payment page and collects billing/customer email information. Card details do not pass through Trayfolio.
5. Stripe sends `checkout.session.completed` to `POST /api/stripe/webhook`.
6. The webhook:
   - Reads the raw body.
   - Validates `stripe-signature` with HMAC SHA-256, constant-time comparison, and a five-minute timestamp tolerance using `STRIPE_WEBHOOK_SECRET`.
   - Ignores unrelated event types or sessions without recognized `metadata.kind`.
   - Finds an active Stripe coupon named **“Demo credit.”**
   - Creates a one-use promotion code named `DEMO-...` that expires in 90 days.
   - Emails the buyer through Resend with confirmation and the code.
   - Retries the buyer email once; if delivery still fails, it can alert the owner with the code for manual recovery.
   - Emails the owner about the order and whether the buyer confirmation was delivered.
   - Returns HTTP 200 after a valid signature even when downstream fulfillment fails, to avoid endless Stripe retries; recovery then depends on logs/owner alerts.
7. `/start/demo-success` tells the buyer Tracy will contact them within 24 hours and that their $50 credit code is on its way.

### Relevant files

- `src/components/DemoCheckoutButton.tsx`
- `src/app/api/checkout/route.ts`
- `src/app/api/stripe/webhook/route.ts`
- `src/lib/pricing.ts`
- `src/lib/stripe.ts`
- `src/lib/submission.ts`
- `src/app/start/demo-success/page.tsx`
- `src/app/start/canceled/page.tsx`
- `src/app/terms/page.tsx`
- `src/app/privacy/page.tsx`

### Environment/configuration dependencies

Secret values were not read or included here. Variable names used by this flow are:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `DEMO_EMAIL_FROM`
- `ALERT_EMAIL`
- `REPLY_TO_EMAIL` (optional fallback behavior exists even if absent locally)

Stripe must also contain an active coupon whose name exactly matches `Demo credit`, and the Stripe webhook endpoint must deliver `checkout.session.completed` to `/api/stripe/webhook`.

### Preservation boundary

Do not change the `kind=demo` contract, server-owned amount, webhook metadata routing, raw-body signature verification, coupon-name dependency, one-use code behavior, expiry behavior, or email/owner-alert chain without dedicated transactional testing. The V2 demo page and CTA styling can change around this boundary while the boundary itself remains stable.

### Risks and alignment work

- Current messaging says the buyer will be contacted within 24 hours; V2 requires demo delivery within 48 hours. The new promise should be explicitly and consistently represented in all user-facing demo copy and operational emails.
- The cancellation page currently says selections remain and links back to the package builder. That is awkward for a fixed demo checkout and will become more misleading if `/start` is de-emphasized.
- The webhook does not persist fulfillment idempotency in the application database. Stripe may deliver the same completed event more than once, so duplicate promotion codes/emails are theoretically possible. This should be reviewed in a later, explicitly authorized payment-hardening phase—not modified during the V2 visual migration.
- Downstream fulfillment failures return 200 by design. Owner alerting and log visibility are therefore operationally important.

## 8. Existing Lead/Contact System

### Visitor experience

- `/contact` displays business email, response-time copy, and `InquiryForm`.
- Fields: name, email, optional phone, business/industry, multi-select project types, required message, and hidden honeypot.
- The client posts JSON to `/api/contact`, shows sending/success/error states, and always provides a direct-email fallback.

### Server behavior

- Same-origin/cross-site checks and a 16 KB bounded JSON body reader.
- Per-instance IP rate limit of four attempts per minute.
- Server validation of names, email shape, message, lengths, honeypot, and an allowlist of project types.
- Prefers Resend when `RESEND_API_KEY` and `DEMO_EMAIL_FROM` exist.
- Sends to `ALERT_EMAIL` or the hardcoded owner email fallback, with the visitor email as `reply_to`.
- Falls back to Web3Forms when `WEB3FORMS_ACCESS_KEY` exists and the Resend path is unavailable.
- Returns generic failure messages rather than provider details.

This is a functional inquiry system and should remain available even after booking is introduced. A scheduling platform should be an additional route/choice, not a reason to remove email/contact fallback. V2 must also update the project-type vocabulary and form framing so it no longer implies package selection.

## 9. Mobile Experience

### Current strengths

- Header switches from inline nav to a compact native `<details>` menu.
- Hero screenshot stack and typography use viewport-relative sizing.
- The long pinned selected-work sequence deliberately becomes a static vertical card list below 768px.
- Grid sections collapse cleanly.
- Coverflow provides touch dragging and a larger mobile scrubber, while preserving vertical page scrolling.
- The comparison uses pointer events with `touch-pan-y`, so vertical scroll is not trapped.
- Buttons commonly meet approximately 44–48px touch-height targets.
- `svh` is used in key full-screen layouts.

### V2 attention points

- The current mobile hero still places a large screenshot composition before the visitor reaches the main proof/CTA story. For Instagram traffic, V2 should prioritize immediate explanation and the two conversion choices above the fold.
- Mobile navigation contains five content links plus a separate Contact CTA; the V2 map should be simplified and the primary CTA made unambiguous.
- The hero and portfolio sections contain large viewport-based text and absolute screenshot stacks that need testing on narrow devices, browser zoom, landscape phones, and short-height screens.
- A hover-only demo is correctly labeled as unavailable on touch, but it is not strong mobile-first proof and should not receive prominent mobile placement.
- Auto-rotating and animated portfolio content should pause reliably during touch/focus and continue respecting reduced motion.
- The fixed analytics-consent panel can occupy up to 70% of viewport height; verify it alongside the mobile menu and primary CTA.
- The external scheduler eventually selected must be assessed for embedded/mobile ergonomics. A simple handoff to the provider may be more reliable than a cramped iframe.

## 10. SEO / Analytics / Performance

### SEO currently present

- Root metadata base, title, description, Open Graph, Twitter card, and 1200×630 image.
- Per-page titles/descriptions and canonical URLs for the main public pages.
- `ProfessionalService` JSON-LD with name, URL, image, description, email, Instagram, and US service area.
- Generated `robots.txt` and sitemap.
- Sitemap currently includes `/`, `/pricing`, `/contact`, `/faq`, `/start`, `/privacy`, and `/terms`; transactional return routes are intentionally excluded.
- Transactional success/cancel pages are marked `noindex` individually.
- Static demos receive `X-Robots-Tag: noindex, follow`.
- App icons and favicon exist.

V2 will need sitemap and per-page metadata for Work, Services, Demo, About, and Book a Call/Contact, plus project/case-study metadata and potentially richer `Service`/project schema where truthful. Old pricing/start URLs will need deliberate redirect/noindex decisions rather than silent deletion.

### Analytics currently present

- Google Analytics 4 is enabled only if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured and valid.
- Explicit accept/reject consent is stored for six months in local storage.
- Analytics cookies are cleared on rejection where accessible.
- Google signals and ad-personalization signals are disabled.
- Page views are sent manually on App Router pathname changes.
- `/start/*` return pages are excluded, and query strings/session IDs are not sent.
- No other analytics, pixels, session recording, or conversion-event tracking was found.

V2 should define privacy-respecting conversion events for booking CTA clicks, scheduler handoff/completion where supported, demo checkout starts, and completed demo purchases. Purchase-success tracking must not leak Stripe session IDs or personal information.

### Performance characteristics

Positive measures already present:

- `next/image` is used for marketing portfolio imagery.
- Local font loading avoids an external font request and reduces layout shift.
- Below-the-fold sections use `content-visibility: auto`.
- Three.js is dynamically imported and preloaded only near its section.
- The comparison video uses `preload="none"` and pauses outside the viewport.
- GSAP effects use scoped cleanup; several effects are desktop-only.
- Scroll progress work is throttled through `requestAnimationFrame`.

Main concerns:

- `public` is about 213 MB and contains duplicate/full static exports plus many large source/media files.
- Homepage/client JavaScript includes several sophisticated interactive systems; the first screen should not require all of them to communicate the offer.
- The above-the-fold portfolio screenshots are explicitly `loading="lazy"`, which can delay visible hero media. If V2 keeps above-fold imagery, loading priority should be reconsidered.
- The deferred shader still loads Three.js when its section approaches, which is appropriate but expensive; it should earn its place in V2.
- Autoplay, requestAnimationFrame physics, GSAP ScrollTriggers, IntersectionObservers, and video can coexist, but each additional animated section increases mobile CPU/GPU pressure.
- Some public assets appear duplicated between root folders and embedded demo exports. Asset ownership and intentional duplication should be documented before cleanup.
- No automated performance budget, Lighthouse workflow, or Web Vitals reporting was found.

### Accessibility characteristics

Strengths:

- Root language, skip link, semantic `main`, nav, footer, headings, form labels, and live status/error regions are present.
- A clear `:focus-visible` outline is defined.
- Main animation systems respect `prefers-reduced-motion`.
- Carousel and comparison components provide keyboard controls, ARIA labels/values, and large handles.
- Decorative images are generally empty-alt/hidden, while portfolio images have descriptive alt text.
- Contact and builder toggles expose pressed state.

Items to verify/improve in V2:

- The native mobile `<details>` menu works without JavaScript, but its open/close state, focus order, outside-click behavior, and overlay positioning should be tested with screen readers and zoom.
- Auto-rotating carousel status/slide changes should be tested for announcement behavior and motion expectations.
- Color contrast should be formally tested, especially small stone text, text over imagery, and outlined/transparent controls.
- The focus outline color should be checked against terracotta/peach surfaces.
- External links currently open new tabs without visible “opens in a new tab” wording.
- Large display type, tight line-height, and clipped/animated words require testing at 200–400% zoom.
- A complete keyboard and screen-reader audit was not found in the repository; source-level affordances are good but do not replace browser/assistive-technology testing.

## 11. Reuse Assessment

### KEEP

- Next.js App Router project and deployment architecture.
- The $50 demo's server-side price, Stripe-hosted Checkout, signed webhook, credit-code issuance, confirmation email, and owner-alert flow.
- Server-side contact form validation, email delivery, error fallback, and privacy copy pattern.
- Consent-aware GA implementation and exclusion of sensitive return URLs.
- Root SEO foundation, canonical pattern, JSON-LD, robots, sitemap, icons, and OG image pattern.
- CMS concepts: schema-driven fields, safe defaults, drafts, real-page preview, publishing, versions, rollback, roles, and audit log.
- Local font infrastructure, earthy brand palette, paper texture, generous spacing, primary/secondary CTA styling.
- Responsive fallbacks and reduced-motion handling.
- `Reveal`, `LayeredWord`, coverflow, comparison, and selected-work presentation as a reusable motion toolkit.
- Existing client work screenshots and the strongest full-site demos.
- Legal/privacy routes as maintained destinations.

### EVOLVE

- Homepage hero: retain typographic confidence, but make the first viewport minimal, explicit, and conversion-led.
- `PortfolioIntro`: separate the simple hero from the selected-work narrative; reuse the showcase later on the page or Work route.
- Portfolio data: move hardcoded arrays into one typed source that can feed Home, Work, and case studies.
- Header/footer: update information architecture, make Book a Free Call primary, Demo secondary, and remove Pricing/Start emphasis.
- Contact: add the scheduler handoff after a provider is selected while retaining the inquiry form and direct email.
- Live demos: curate them by strategic value, distinguish client work from concepts/effects, and improve in-site storytelling.
- Services: move from a brief three-column homepage block to a concise teaser plus dedicated Services page with no public custom-project prices.
- CMS schema: add fields/sections only after V2 structures are stable; preserve the generic dashboard mechanics.
- FAQ and legal copy: replace package-specific answers with consultation/scope language while keeping payment/demo facts accurate.
- Animation: use the existing toolkit selectively, especially below the opening CTA, with explicit mobile and performance budgets.
- Analytics: add non-PII conversion measurement after new journeys exist.

### REMOVE / RECONSIDER

- Public fixed package prices and the package-comparison matrix.
- Public add-on price catalog.
- `/start` project configurator as a primary navigation/conversion path.
- “Build it, see the price, pay half” positioning.
- Pricing links in the header, footer, FAQ CTA, brand callout, terms cross-links, and homepage.
- FAQ answers that quote Starter/Growth/Signature pricing.
- Pricing-focused metadata and sitemap entries after migration.
- Long animated content before visitors understand what Trayfolio does and how to proceed.
- Equal visual weight for experiments and proven client projects.
- Direct-to-client-site links as the only portfolio experience.
- Unused animation experiments in the shipped bundle/source surface unless there is a documented V2 role.

“Remove” here means remove from the eventual public V2 experience after dependencies and redirects are resolved—not delete immediately.

### ADD

- Dedicated `/work`, `/services`, `/demo` (or clearly named `$50 Demo`), and `/about` pages.
- A Book a Free 15-Minute Call route/CTA connected to the selected external scheduler.
- Phone versus video-call choice, implemented through the scheduling provider rather than custom scheduling code.
- In-site case studies or immersive project-detail routes.
- Real client testimonials with permission and attribution.
- A concise process section.
- A brief founder introduction that supports, rather than replaces, the Trayfolio brand.
- Clear nationwide small-business positioning.
- Consistent 48-hour demo-delivery copy and operational expectations.
- Conversion-event taxonomy and a lightweight performance/accessibility QA checklist.
- Asset/media budget and project-content model.

## 12. V2 Gap Analysis

| V2 direction | Current state | Required change |
|---|---|---|
| Premium, modern, clean, trustworthy | Strong visual craft and motion; opening is dense and portfolio-led | Simplify first viewport, strengthen hierarchy and proof sequence |
| Nationwide small-business studio | Copy says small businesses; some project labels emphasize Austin/local examples | Make nationwide service area and ideal-client positioning explicit |
| Book a Free 15-Minute Call as primary CTA | No scheduler or dedicated booking path; Contact is primary fallback | Select provider, configure 15-minute phone/video event, then integrate |
| $50 Demo as secondary CTA | Working checkout and multiple CTAs exist | Create dedicated explanatory page and align 48-hour promise |
| No public custom-project prices | Full packages/add-ons/configurator are central | Migrate nav, content, FAQ, metadata, terms, and project checkout exposure |
| Minimal first screen | Tall animated screenshot hero starts immediately | Build a typography-first hero with two clear CTAs |
| Story after hero | Work/demos/services exist, but testimonials, process, founder story are absent | Re-sequence and add missing trust/story sections |
| Approximately three homepage projects | Three featured plus three recent plus five demos | Curate three strongest projects; move breadth to Work |
| Premium in-site portfolio experience | Featured cards mainly link off-site; demos remain on-site | Add case-study/detail experiences and secondary live-site links |
| Dedicated Work page | Missing | Add after project content model is defined |
| Dedicated Services page | Missing | Add service narrative without price table |
| Dedicated Demo page | Demo currently embedded in Home/Pricing | Add focused offer, process, promise, terms, and existing checkout button |
| About/founder presence | No About page; footer only says “Built by Tracy Holbrook” | Add restrained founder/brand story and credibility elements |
| Mobile-first Instagram conversion | Responsive implementation is competent, but journey remains content-heavy | Design mobile hero/nav/CTA sequence first and test scheduler handoff |
| External scheduling | Not selected | Do not implement until platform is chosen; preserve inquiry fallback |
| Social proof | No testimonial system found | Collect verified testimonials and add schema/content model if appropriate |
| Process clarity | Some checkout-success steps exist, not a public process story | Create a simple public discovery → strategy → design/build → launch/support sequence |

## 13. Recommended Implementation Order

### Phase 0 — Protect the baseline

- Create a V2 branch/worktree when implementation begins.
- Record current production URLs and test the contact form, demo checkout in Stripe test mode, webhook emails, and CMS login/preview/publish flow.
- Capture responsive screenshots or a short visual baseline for the current homepage and transaction states.
- Document the existing environment-variable names and Stripe coupon/webhook configuration without copying secrets.
- Decide how the current uncommitted changes should be handled before overlapping edits begin.

**Exit condition:** Existing production behavior is reproducible and the demo flow has a written test checklist.

### Phase 1 — Finalize content architecture and conversion decisions

- Confirm the V2 route names and URL policy, especially `/demo` versus another label and whether `/contact` becomes `/book` or remains a combined page.
- Select the scheduling platform and verify it supports 15-minute appointments plus phone/video choice.
- Choose the three flagship projects and determine which have sufficient material for real case studies.
- Gather approved testimonials, founder copy/photo, project facts/outcomes, and the exact demo terms/promise.
- Decide what should remain editable in the CMS.

**Exit condition:** No page implementation is blocked by unresolved navigation, provider, content, or legal-language decisions.

### Phase 2 — Create shared V2 foundations without changing the live journey

- Formalize semantic design tokens and shared button/container/section primitives from the current palette and patterns.
- Create a typed central project/case-study model.
- Separate reusable motion primitives from page-specific choreography.
- Establish an image/video budget and classify duplicate/legacy demo assets; do not delete assets used by existing routes.
- Add route-level test/QA expectations for keyboard, reduced motion, mobile sizes, and metadata.

**Exit condition:** New pages can reuse stable primitives and one project source of truth.

### Phase 3 — Build secondary V2 pages first

- Add Work and project detail/case-study experiences.
- Add Services with scope-by-conversation positioning.
- Add the dedicated $50 Demo page around the unchanged checkout boundary.
- Add About with concise founder presence.
- Build Book a Call / Contact only after the external provider is selected; keep the existing inquiry form as fallback.
- Add metadata and CMS fields for these routes where useful.

Keep the current homepage/navigation live while these pages are built and reviewed by direct URL.

**Exit condition:** Every destination required by the future V2 navigation is complete and mobile-verified.

### Phase 4 — Restructure the homepage

- Replace the opening with a minimal, type-led statement and the two primary conversion paths.
- Reuse a curated version of the existing selected-work interaction after the hero.
- Add approach, testimonials, process, demo offer, brief founder block, and final CTA in the agreed story order.
- Keep only motion that strengthens comprehension or proof.
- Update the CMS schema/default copy after the new content structure is stable.

**Exit condition:** The homepage communicates who Trayfolio serves, what it does, and both next actions within the first mobile viewport.

### Phase 5 — Switch global navigation and conversion paths

- Update header/footer to Home, Work, Services, $50 Demo, About, and Book a Call/Contact.
- Make Book a Free Call the primary global CTA and Get a $50 Demo the secondary CTA.
- Remove public links to Pricing and the project builder.
- Update FAQ, homepage cross-links, sitemap, structured data, and page metadata.
- Ensure demo cancellation/success states no longer send visitors into obsolete package language.

**Exit condition:** No normal visitor journey exposes fixed custom-project pricing.

### Phase 6 — Retire legacy pricing safely

- Decide whether `/pricing` and `/start` should redirect, remain temporarily unlisted/noindex, or be retained as private/manual sales tools.
- Preserve `/api/checkout`'s demo branch and webhook behavior even if the project-deposit branch is no longer publicly reachable.
- Update Terms and Privacy before changing transactional availability.
- Add redirects only after confirming there are no active campaigns, bookmarks, or operational workflows depending on the old pages.

**Exit condition:** Legacy URLs have intentional behavior, and the $50 demo remains fully functional.

### Phase 7 — Verify and launch

- Test on narrow phones, larger phones, tablets, short-height laptops, desktop, keyboard-only, reduced motion, and browser zoom.
- Run accessibility checks plus manual screen-reader/navigation review.
- Measure Lighthouse/Core Web Vitals and inspect media/network waterfalls.
- Run Stripe test purchases through success, cancel, webhook, credit-email, duplicate-event/retry scenarios, and owner-alert failure paths.
- Test contact and scheduler journeys, consent accept/reject/reset, CMS editing/publishing, canonical tags, robots, sitemap, and redirects.
- Compare production analytics and conversion behavior after release, then tune rather than adding more visual complexity by default.

## Final Recommendation

Trayfolio V2 should be implemented as a controlled information-architecture and conversion-layer migration inside the existing application. The codebase already contains meaningful competitive advantages—especially its portfolio interactions, live demos, content editor, and demo-payment fulfillment. Rebuilding from scratch would create unnecessary risk. The highest-value change is to simplify what visitors see first and remove public custom-project pricing from the primary journey while keeping the proven systems behind it intact.
