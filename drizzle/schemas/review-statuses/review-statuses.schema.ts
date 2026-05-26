import { pgTable, text, uuid, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { generatedContent } from "../generated-content/generated-content.schema";
import { profiles } from "../profiles/profiles.schema";
import { baseColumns } from "../base";

/**
 * REVIEW_STATUSES TABLE
 *
 * RLS Policies:
 * - SELECT: (role IN ('admin', 'contributor', 'operator')) -- Internal roles can view reviews
 * - WRITE (INSERT/UPDATE/DELETE): (role IN ('admin', 'operator')) -- Admin and operators can manage review statuses
 */
export const reviewStatuses = pgTable(
  "review_statuses",
  {
    ...baseColumns,
    generatedContentId: uuid("generated_content_id").references(() => generatedContent.id),
    reviewedBy: uuid("reviewed_by").references(() => profiles.id),
    status: text("status").notNull(), // 'awaiting_review' | 'approved' | 'rejected'
    checkboxFactual: boolean("checkbox_factual"),
    checkboxNdaSafe: boolean("checkbox_nda_safe"),
    checkboxTone: boolean("checkbox_tone"),
    rejectionReason: text("rejection_reason"), // predefined enum: 'inaccurate' | 'nda_violation' | 'inappropriate_tone' | 'poor_quality' | 'off_brand' | 'missing_context' | 'other'
    reviewedAt: timestamp("reviewed_at"),
  },
  (table) => ({
    generatedContentIdIdx: index("review_statuses_generated_content_id_idx").on(
      table.generatedContentId
    ),
    reviewedByIdx: index("review_statuses_reviewed_by_idx").on(table.reviewedBy),
  })
);
