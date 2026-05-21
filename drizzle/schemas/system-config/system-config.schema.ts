import { pgTable, text, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { profiles } from "../profiles/profiles.schema";

export const systemConfig = pgTable("system_config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedBy: uuid("updated_by").references(() => profiles.id),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (table) => ({
  updatedByIdx: index("system_config_updated_by_idx").on(table.updatedBy),
}));
