import { pgTable, text, uuid, index } from "drizzle-orm/pg-core";
import { profiles } from "../profiles/profiles.schema";
import { baseColumns } from "../base";

export const bannedPhrases = pgTable("banned_phrases", {
  ...baseColumns,
  phrase: text("phrase").notNull(),
  addedBy: uuid("added_by").references(() => profiles.id),
}, (table) => ({
  addedByIdx: index("banned_phrases_added_by_idx").on(table.addedBy),
}));
