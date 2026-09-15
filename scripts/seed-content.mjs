// One-off seeder for phase 0 of the client CMS system. Inserts today's
// hardcoded homepage hero subheading as the initial content_values row, so
// switching the site over to reading from the database doesn't change what
// visitors see. Safe to re-run: uses ON CONFLICT DO NOTHING.
//
// Run after `npx drizzle-kit migrate` has created the content_values table.
// Plain ESM, no TypeScript/esbuild involved, so it runs the same on any
// platform (unlike drizzle-kit itself, which needs to run on your Mac).
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const HERO_LEDE =
  "Custom strategy, design, and development—from the first idea to a site ready to win customers.";

const rows = await sql`
  insert into content_values (section_key, field_key, value)
  values ('home', 'heroLede', ${JSON.stringify(HERO_LEDE)}::jsonb)
  on conflict (section_key, field_key) do nothing
  returning id
`;

console.log(
  rows.length > 0
    ? `Seeded home.heroLede (row id ${rows[0].id})`
    : "home.heroLede already exists, left it as-is",
);
