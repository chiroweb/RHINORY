import { adminActivityLogs } from "../db/schema";
import type { getDb } from "../db";

type AdminDb = NonNullable<ReturnType<typeof getDb>>;

export async function recordAdminActivity(
  db: AdminDb,
  action: string,
  entityType: string,
  entityId: string | number = "",
  metadata: Record<string, unknown> = {},
) {
  try {
    await db.insert(adminActivityLogs).values({ action, entityType, entityId: String(entityId), metadata });
  } catch (error) {
    // Audit logging must never make the underlying admin operation fail.
    console.error("admin activity log failed", error);
  }
}
