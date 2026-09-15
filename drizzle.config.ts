import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit is a standalone CLI, not Next.js, so it doesn't get the
// automatic .env.local loading that `next dev`/`next build` do. Load it
// explicitly so `npx drizzle-kit ...` picks up DATABASE_URL the same way
// the app itself does.
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
