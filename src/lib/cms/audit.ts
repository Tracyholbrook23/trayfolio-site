import "server-only";
import { db } from "@/lib/db/client";
import { auditLog } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function writeAudit(entry: typeof auditLog.$inferInsert) {
  await db.insert(auditLog).values(entry);
}

export async function getAuditEntries(limit = 100) {
  return db.select().from(auditLog).orderBy(desc(auditLog.createdAt), desc(auditLog.id)).limit(limit);
}
