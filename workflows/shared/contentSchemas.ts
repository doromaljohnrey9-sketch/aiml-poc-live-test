import { z } from "zod";

// Define structured content schemas for AI generation
// TODO: Enable LinkedIn content generation in V2 - currently disabled per PRD V1 scope
export const LinkedInContentSchema = z.object({
  post: z.string().describe("Main LinkedIn post content"),
  hashtags: z.array(z.string()).describe("Relevant hashtags"),
});

// TODO: Enable Blog content generation in V2 - currently disabled per PRD V1 scope
export const BlogContentSchema = z.object({
  title: z.string().describe("Blog post title"),
  content: z.string().describe("Full blog post content with markdown formatting"),
  excerpt: z.string().describe("Short excerpt/summary for meta description"),
});

export const NewsletterContentSchema = z.object({
  subject: z.string().describe("Email subject line"),
  preview: z.string().describe("Preview text shown in email clients"),
  title: z.string().describe("Newsletter title/header"),
  body: z.string().describe("Main newsletter body content"),
  cta: z.string().describe("Call-to-action text"),
  callout: z.string().optional().describe("Optional highlighted callout box"),
  quote: z.string().optional().describe("Optional inspirational quote"),
});

export const GeneratedContentSchema = z.object({
  linkedin: LinkedInContentSchema,
  blog: BlogContentSchema,
  newsletter: NewsletterContentSchema,
});

export type GeneratedContent = z.infer<typeof GeneratedContentSchema>;
