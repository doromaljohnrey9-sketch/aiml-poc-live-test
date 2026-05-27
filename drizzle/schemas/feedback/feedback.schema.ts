import { pgTable, integer, text, uuid, index } from "drizzle-orm/pg-core";
import { profiles } from "../profiles/profiles.schema";
import { baseColumns } from "../base";

/**
 * FEEDBACK TABLE
 *
 * RLS Policies:
 * - SELECT: (role IN ('admin')) -- Only admins can view feedback
 * - WRITE (INSERT/UPDATE/DELETE): (role IN ('admin')) -- Only admins can manage feedback
 * - INSERT: Authenticated users can insert their own feedback
 */
export const feedback = pgTable(
  "feedback",
  {
    ...baseColumns,
    userId: uuid("user_id").references(() => profiles.id),
    rating: integer("rating").notNull(), // 1-5 scale
    message: text("message").notNull(),
  },
  (table) => ({
    userIdIdx: index("feedback_user_id_idx").on(table.userId),
  })
);
