import { pgTable, text, uuid, integer, timestamp, index } from "drizzle-orm/pg-core";
import { distributionLogs } from "../distribution-logs/distribution-logs.schema";
import { baseColumns } from "../base";

export const engagementMetrics = pgTable("engagement_metrics", {
  ...baseColumns,
  distributionLogId: uuid("distribution_log_id").references(() => distributionLogs.id),
  channel: text("channel").notNull(),
  metricType: text("metric_type").notNull(), // 'view' | 'click' | 'reaction' | 'open' | 'inquiry'
  value: integer("value").default(0),
  recordedAt: timestamp("recorded_at").defaultNow(),
}, (table) => ({
  distributionLogIdIdx: index("engagement_metrics_distribution_log_id_idx").on(table.distributionLogId),
}));
