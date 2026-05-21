import { pgTable, text, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { generatedContent } from "../generated-content/generated-content.schema";
import { baseColumns } from "../base";

export const distributionLogs = pgTable("distribution_logs", {
  ...baseColumns,
  generatedContentId: uuid("generated_content_id").references(() => generatedContent.id),
  channel: text("channel").notNull(), // 'linkedin' | 'blog' | 'newsletter'
  status: text("status").notNull().default("pending"), // 'pending' | 'success' | 'failed'
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  externalPostId: text("external_post_id"),
  errorMessage: text("error_message"),
}, (table) => ({
  generatedContentIdIdx: index("distribution_logs_generated_content_id_idx").on(table.generatedContentId),
}));
