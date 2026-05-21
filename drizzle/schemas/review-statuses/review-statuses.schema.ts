import { pgTable, text, uuid, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { generatedContent } from "../generated-content/generated-content.schema";
import { profiles } from "../profiles/profiles.schema";
import { baseColumns } from "../base";

export const reviewStatuses = pgTable("review_statuses", {
  ...baseColumns,
  generatedContentId: uuid("generated_content_id").references(() => generatedContent.id),
  reviewedBy: uuid("reviewed_by").references(() => profiles.id),
  status: text("status").notNull(), // 'awaiting_review' | 'approved' | 'rejected'
  checkboxFactual: boolean("checkbox_factual"),
  checkboxNdaSafe: boolean("checkbox_nda_safe"),
  checkboxTone: boolean("checkbox_tone"),
  rejectionReason: text("rejection_reason"),
  reviewedAt: timestamp("reviewed_at"),
}, (table) => ({
  generatedContentIdIdx: index("review_statuses_generated_content_id_idx").on(table.generatedContentId),
  reviewedByIdx: index("review_statuses_reviewed_by_idx").on(table.reviewedBy),
}));
