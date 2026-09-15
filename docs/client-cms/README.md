# Client CMS system: build log

The full architecture proposal lives alongside this file in `architecture.md`.
This file tracks what's actually been built here in trayfolio-site, which is
the proving ground before this gets rolled onto a real client site (see
phase 6/7 of the plan). Full context also in memory at
/areas/client-cms-system.md.

## Phase 0: prove the read + cache-invalidation path (in progress)

Goal: one real field reads from Postgres instead of being hardcoded, with
zero visible change to the live site. No dashboard, no login yet.

Field chosen: the homepage hero subheading ("Custom strategy, design, and
development...", the `<p className="portfolio-hero__lede">` in
`src/components/PortfolioIntro.tsx`), because it's plain text with no
embedded markup, so it's a clean first test of the pattern.

What's done:
- `src/lib/db/schema.ts`: the `content_values` table (just this one table
  for now, the rest get added in later phases as the dashboard needs them).
- `src/lib/db/client.ts`: Drizzle + Neon client, reads `DATABASE_URL`.
- `src/lib/cms/get-content.ts`: `getContentValue(section, field, fallback)`,
  cached and tagged `content:<section>` for `revalidateTag` later.
- `src/lib/cms/content.schema.ts`: the editable-content contract, one field
  so far (`home.heroLede`).
- `src/app/page.tsx` and `src/components/PortfolioIntro.tsx` wired up to
  read that field instead of a hardcoded string.
- `drizzle.config.ts` added.

Status:
1. Done: Neon project "trayfolio-site" created (org "Trayfolio", free plan,
   AWS US East 2). Connection string is already in `.env.local` as
   `DATABASE_URL`.
2. Done: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, and
   `dotenv` installed. `drizzle.config.ts` loads `.env.local` explicitly
   (drizzle-kit is a standalone CLI, it doesn't get Next.js's automatic
   env-file loading).
3. Done: `npx drizzle-kit generate` ran, produced
   `drizzle/0000_cute_gauntlet.sql`.
4. **Still needed, on your Mac terminal**: `npx drizzle-kit migrate`.
   This has to run locally, not through the device bridge, drizzle-kit
   pulls in esbuild to read the TypeScript config file, and esbuild ships
   a platform-specific native binary (same class of issue as lightningcss
   elsewhere in your projects, just a different package this time).
5. Once migrate has run, seeding is one command, no SQL editor needed:
   `node scripts/seed-content.mjs` (safe to re-run, does nothing if the
   row already exists). This one's plain JS, no TypeScript/esbuild, so it
   runs fine from either your terminal or the device bridge.
6. `npm run dev` locally and confirm the homepage looks identical.
7. Add `DATABASE_URL` to the trayfolio Vercel project's Environment
   Variables before deploying, same way as the Stripe/Resend keys.

## Phase 0: confirmed working

Verified in the browser 2026-09-15: homepage hero subheading renders
identically, pulled from Postgres instead of hardcoded.

## Phase 1: login and sessions (in progress)

Goal: a real login gate on /client/dashboard. Still just a placeholder
dashboard page (proves the loop), no actual content editing yet, that's
phase 2.

What's done:
- `src/lib/db/schema.ts`: added the `users` table (email, password_hash,
  role, disabled_at). No self-signup anywhere, accounts are created ahead
  of time via `scripts/create-user.mjs`.
- `src/lib/auth/session-options.ts`: shared iron-session config (no
  `next/headers` import, so it's safe to use from both Server
  Components/Actions AND middleware's Edge runtime).
- `src/lib/auth/session.ts`: `getSession()` for use in Server
  Components/Actions.
- `src/lib/auth/password.ts`: bcrypt hash/verify (12 salt rounds).
- `src/lib/auth/actions.ts`: `login()` and `logout()` Server Actions. Same
  generic "Incorrect email or password" error whether the account doesn't
  exist, is disabled, or the password is wrong.
- `src/app/client/login/`: the login page and form.
- `src/app/client/dashboard/page.tsx`: placeholder, shows who's logged in
  and a logout button. Gets replaced by the real schema-driven editor in
  phase 2.
- `src/proxy.ts`: the actual enforcement point, redirects a logged-out
  visitor away from `/client/dashboard/*` to `/client/login`. (Lives in
  `src/`, not the repo root, since this project uses a `src/` layout. Also
  named `proxy.ts`, not `middleware.ts`: Next.js 16 renamed the file
  convention, `middleware.ts` still half-works but prints a deprecation
  warning and Turbopack complained about it in dev.)
- `SESSION_SECRET` generated and added to `.env.local` (a random 32-byte
  value used to encrypt the session cookie).

Known gap, deliberately deferred rather than silently skipped: no rate
limiting on login attempts yet (the architecture doc recommends Upstash for
this). Fine for a single-user test on trayfolio-site; needs adding before
this goes on an actual client site. No account lockout either, same
reasoning.

Still needed, on your Mac terminal (same esbuild-needs-your-platform reason
as phase 0's migration step):
1. `npm install iron-session bcryptjs` and `npm install -D @types/bcryptjs`
2. `npx drizzle-kit generate` then `npx drizzle-kit migrate` (adds the
   `users` table)
3. `node scripts/create-user.mjs you@example.com OWNER` and follow the
   password prompt. This one asks for your password interactively with
   echo turned off, never run it any other way and never paste a password
   into chat.
4. `npm run dev`, visit `/client/login`, confirm you can log in, land on
   `/client/dashboard`, and that logging out and revisiting
   `/client/dashboard` redirects you back to the login page.
5. Before deploying: add `SESSION_SECRET` to the trayfolio Vercel project's
   Environment Variables too (generate a separate one for production,
   don't reuse the local one, `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   prints a fresh one).

## Phase 2: schema-driven editor, draft save, Draft Mode preview

Goal: replace the placeholder dashboard with a real editor, driven
entirely by content.schema.ts, that saves unpublished drafts and lets you
preview them on the real site before anything goes live. Publishing
(copying a draft into content_values) is still the next phase, not this
one, saving a draft does not change what visitors see.

What's done:
- `src/lib/db/schema.ts`: added the `content_drafts` table, same shape as
  `content_values` (one row per sectionKey+fieldKey), so an unpublished
  edit lives entirely separately from the live value.
- `src/lib/cms/get-content.ts`: `getContentValue()` now checks Next.js
  Draft Mode; when it's on, it reads a field's draft first and only falls
  back to the published value if that field has no draft yet. Added
  `getEditableValue()`, an uncached read used only by the dashboard, which
  also reports whether what it's showing is a draft or the last published
  value.
- `src/lib/cms/validate.ts`: server-side validation per FieldDef (required,
  min/max length, and format checks for email/phone/url/price/number).
  This is the actual guardrail, not the form's own `maxLength` attributes.
- `src/lib/cms/actions.ts`: three Server Actions.
  - `saveDraftAction`: re-checks the session itself (never trusts
    `proxy.ts` alone), looks the field up in `contentSchema` itself (never
    trusts the section/field keys a request claims), validates, then
    upserts into `content_drafts`.
  - `enablePreviewAction`: turns on Draft Mode, sends you to the live
    homepage.
  - Logging out turns Draft Mode back off.
- `src/app/client/dashboard/page.tsx`: now a section list generated from
  `contentSchema`, plus a "Preview saved drafts on live site" button.
- `src/app/client/dashboard/[section]/`: the generic per-section editor.
  One form per field, rendered from that field's `FieldDef`
  (`page.tsx` fetches the data, `section-editor-form.tsx` is the actual
  form, a client component so it can show save/error state inline).
- `src/components/cms/VisualEditorToolbar.tsx`: page-scoped editing,
  publishing, draft status, and exit controls.

Known gap, deliberately deferred: every logged-in role (OWNER,
CLIENT_ADMIN, CLIENT_EDITOR) can currently edit every section, there's no
per-role restriction on which sections/fields someone can touch yet. Fine
for solo testing with one OWNER account; worth adding before a real client
site has more than one login.

Still needed, on your Mac terminal (same esbuild-needs-your-platform
reason as phases 0 and 1):
1. `npx drizzle-kit generate` then `npx drizzle-kit migrate` (adds the
   `content_drafts` table).
2. `npm run dev`, log in, open the Home section, change the hero
   subheading, and hit "Save draft" — confirm it shows "Draft saved." and
   an "Unpublished draft" tag, and that the public homepage still shows
   the OLD text (nothing publishes yet).
3. Go back to `/client/dashboard` and click "Preview saved drafts on live
   site" — confirm you land on the homepage with the amber preview banner
   showing, and the hero subheading now shows your edited text.
4. Click "Exit preview" in the banner — confirm the banner disappears and
   the homepage goes back to showing the old, published text.

## Phase 3: publish

Goal: an actual "Publish" action that takes a section's saved drafts and
makes them live, the missing piece that made phase 2 draft-only.

What's done:
- `src/lib/db/schema.ts`: added `content_versions`, an append-only log (no
  unique constraint, a field can have many rows over time). Every publish
  writes one row per field here with the value being published, so this
  doubles as both publish history and the future rollback feature's data
  source (a rollback is just "publish this old row's value again", not a
  separate mechanism).
- `src/lib/cms/actions.ts`: `publishSectionAction`. Re-checks the session
  itself (same defense-in-depth reasoning as `saveDraftAction`), reads
  every drafted field in the section, and for each one: upserts
  `content_values`, logs a `content_versions` row, deletes the draft.
  Calls `revalidateTag` once at the end so the site updates immediately,
  and redirects back to the same section afterward (this is what clears
  the "Unpublished draft" tags right away, that state gets refetched on
  the redirect).
- `src/app/client/dashboard/[section]/publish-section-button.tsx`: a
  "Publish section" button next to the section heading, with a native
  confirm dialog since this is the action that actually changes what
  visitors see. Publishing with nothing drafted shows an inline error
  instead of doing anything.

Not built yet, on purpose: a version history viewer or rollback UI
(`content_versions` is being written to starting now, so the data will be
there once that UI exists), and a separate audit log table (logins,
disables, etc. aren't tracked yet, just content publishes).

Still needed, on your Mac terminal:
1. `npx drizzle-kit generate` then `npx drizzle-kit migrate` (adds
   `content_versions`).
2. `npm run dev`, edit the Home Page hero subheading, save a draft, then
   click "Publish section" (confirm the dialog) — confirm the live
   homepage now shows the new text immediately, and the "Unpublished
   draft" tag is gone.
3. Try clicking "Publish section" again with nothing changed — confirm
   you get "Nothing to publish" instead of a silent no-op or an error
   page.

## Phase 4: text-complete client editing (in progress)

The CMS is no longer limited to the homepage hero subheading. The schema is
now the source of both validation rules and safe default copy, so fields show
their real starting text in a fresh dashboard without requiring seed rows.

Built in this phase:
- Page-aware preview links; preview opens the page being edited.
- Editable Home hero and selected-work introduction copy.
- Editable Contact, Start, FAQ, and non-transactional Pricing page copy.
- 89 schema-governed text fields, with per-field length and format limits.
- Click-to-edit affordances for the newly connected public text.
- Visual editing on the actual website: login now opens the homepage in Edit
  mode, clicking text opens an anchored editing panel, and a floating toolbar
  publishes the current page. The section dashboard remains as a fallback.
- Live database rechecks for every mutation. Disabled/deleted accounts are
  rejected even if an old encrypted session cookie still exists.
- Role enforcement: all active roles may save drafts, OWNER and CLIENT_ADMIN
  may publish, and rollback is OWNER-only.
- Visual toolbar draft counts, disabled publish when nothing has changed, and
  confirmed page-level draft discard.
- Remaining safe homepage text connected, including project descriptions,
  services, demos intro, brand callout, and contact CTA. Fixed item counts keep
  the layout developer-controlled while every item’s copy remains editable.
- Persistent database-backed login throttling (five failures per email/network
  pair in 15 minutes), including constant-cost bcrypt verification for unknown
  accounts.
- Append-only CMS/security activity logging and an OWNER-only activity screen.

Pricing amounts, package contents, checkout terms, legal copy, navigation,
routes, and layout remain developer-controlled. Those values affect contracts
or application behavior and must not drift away from the actual checkout
configuration.

## Next phases

1. Exercise the full workflow with a client-style acceptance test.
2. Extract the proven implementation into a shared package.
3. Install it on the first real client site and adapt that site’s schema.
4. Add images later as a separate constrained phase (Vercel Blob + sharp).
