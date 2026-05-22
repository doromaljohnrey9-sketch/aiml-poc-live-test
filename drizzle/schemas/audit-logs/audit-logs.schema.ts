import { pgTable, text, uuid, jsonb, index } from "drizzle-orm/pg-core";
import { profiles } from "../profiles/profiles.schema";
import { baseColumns } from "../base";

/**
 * AUDIT_LOGS TABLE
 *
 * RLS Policies:
 * - SELECT: (role = 'admin') -- Only admins can view audit logs
 * - INSERT/UPDATE/DELETE: (role = 'admin') -- Only admins (or system) can modify audit logs
 */
export const auditLogs = pgTable(
  "audit_logs",
  {
    ...baseColumns,
    actorId: uuid("actor_id").references(() => profiles.id),
    action: text("action").notNull(),
    entityType: text("entity_type"),
    entityId: uuid("entity_id"),
    payload: jsonb("payload"),
  },
  (table) => ({
    actorIdIdx: index("audit_logs_actor_id_idx").on(table.actorId),
    entityIdIdx: index("audit_logs_entity_id_idx").on(table.entityId),
  })
);
