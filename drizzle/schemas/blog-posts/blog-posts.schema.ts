import { pgTable, text, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { generatedContent } from "../generated-content/generated-content.schema";
import { baseColumns } from "../base";

/**
 * BLOG_POSTS TABLE
 *
 * RLS Policies:
 * - SELECT: (status = 'published' OR role IN ('admin', 'contributor')) -- Published posts are public; drafts for admin/authors
 * - WRITE (INSERT/UPDATE/DELETE): (role IN ('admin', 'contributor')) -- Admins and contributors can manage posts
 */
export const blogPosts = pgTable(
  "blog_posts",
  {
    ...baseColumns,
    generatedContentId: uuid("generated_content_id").references(() => generatedContent.id),
    title: text("title").notNull(),
    slug: text("slug").unique().notNull(),
    content: text("content").notNull(),
    status: text("status").notNull().default("draft"), // 'draft' | 'published'
    publishedAt: timestamp("published_at"),
  },
  (table) => ({
    generatedContentIdIdx: index("blog_posts_generated_content_id_idx").on(
      table.generatedContentId
    ),
  })
);
