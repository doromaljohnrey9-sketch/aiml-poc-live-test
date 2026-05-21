import { pgTable, text, uuid, integer, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { contentSources } from "../content-sources/content-sources.schema";
import { baseColumns } from "../base";

export const generatedContent = pgTable("generated_content", {
  ...baseColumns,
  contentSourceId: uuid("content_source_id").references(() => contentSources.id),
  generatedText: text("generated_text").notNull(),
  channelFormats: jsonb("channel_formats"), // { linkedin: "...", blog: "...", newsletter: "..." }
  language: text("language").notNull(), // 'en' | 'ko'
  generationAttempt: integer("generation_attempt").default(1),
  modelUsed: text("model_used").default("gpt-4"),
  promptVersion: text("prompt_version"),
  bannedPhraseHit: boolean("banned_phrase_hit").default(false),
}, (table) => ({
  contentSourceIdIdx: index("generated_content_content_source_id_idx").on(table.contentSourceId),
}));
