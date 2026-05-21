import { pgTable, text, uuid, jsonb, index } from "drizzle-orm/pg-core";
import { profiles } from "../profiles/profiles.schema";
import { baseColumns } from "../base";

export const auditLogs = pgTable("audit_logs", {
  ...baseColumns,
  actorId: uuid("actor_id").references(() => profiles.id),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: uuid("entity_id"),
  payload: jsonb("payload"),
}, (table) => ({
  actorIdIdx: index("audit_logs_actor_id_idx").on(table.actorId),
  entityIdIdx: index("audit_logs_entity_id_idx").on(table.entityId),
}));
