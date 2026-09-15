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

## Next phases (not started)

1. Schema-driven dashboard for the Home section (draft save + Draft Mode
   preview)
2. Publish action + version history + audit log
3. Images (Vercel Blob + sharp)
4. Expand the schema to more sections
5. Extract into a shared package once proven here
