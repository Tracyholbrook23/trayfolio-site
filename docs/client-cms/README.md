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

## Next phases (not started)

1. Auth (`users` table, login page, `iron-session`, `middleware.ts`)
2. Schema-driven dashboard for the Home section (draft save + Draft Mode
   preview)
3. Publish action + version history + audit log
4. Images (Vercel Blob + sharp)
5. Expand the schema to more sections
6. Extract into a shared package once proven here
