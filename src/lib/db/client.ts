import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env.local for local dev, and to the " +
      "trayfolio project's Environment Variables in Vercel for production.",
  );
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
