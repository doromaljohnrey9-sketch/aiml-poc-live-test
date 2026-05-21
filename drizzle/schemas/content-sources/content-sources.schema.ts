import { pgTable, text, uuid, index } from "drizzle-orm/pg-core";
import { profiles } from "../profiles/profiles.schema";
import { baseColumns } from "../base";

/**
 * CONTENT_SOURCES TABLE
 *
 * RLS Policies:
 * - SELECT: (role IN ('admin', 'contributor')) -- Admins and contributors can view content sources
 * - WRITE (INSERT/UPDATE/DELETE): (role IN ('admin', 'contributor')) -- Only admins and contributors can manage sources
 */
export const contentSources = pgTable("content_sources", {
  ...baseColumns,
  submittedBy: uuid("submitted_by").references(() => profiles.id),
  inputType: text("input_type").notNull(), // 'url' | 'text' | 'document'
  rawInput: text("raw_input"),
  extractedText: text("extracted_text"),
  contextNote: text("context_note"),
  language: text("language").notNull(), // 'en' | 'ko'
  status: text("status").notNull().default("pending"), // 'pending' | 'processing' | 'processed' | 'failed'
}, (table) => ({
  submittedByIdx: index("content_sources_submitted_by_idx").on(table.submittedBy),
}));
