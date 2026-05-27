import { FatalError } from "workflow";
import { db } from "@/lib/drizzle/db";
import { generatedContent } from "@/drizzle/schemas/generated-content/generated-content.schema";
import { contentSources } from "@/drizzle/schemas/content-sources/content-sources.schema";
import { reviewStatuses } from "@/drizzle/schemas/review-statuses/review-statuses.schema";
import { eq } from "drizzle-orm";
import { notifyOperators as notifyOps } from "../shared/notifyOperators";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { GeneratedContentSchema, type GeneratedContent } from "../shared/contentSchemas";

export async function fetchContentSource(generatedContentId: string) {
  "use step";

  // Fetch generated_content by ID
  const genContent = await db
    .select()
    .from(generatedContent)
    .where(eq(generatedContent.id, generatedContentId))
    .limit(1);

  if (genContent.length === 0) {
    throw new FatalError(`Generated content not found: ${generatedContentId}`);
  }

  const contentSourceId = genContent[0].contentSourceId;
  if (!contentSourceId) {
    throw new FatalError(
      `Generated content has no associated content source: ${generatedContentId}`
    );
  }

  // Fetch the associated content_source
  const source = await db
    .select()
    .from(contentSources)
    .where(eq(contentSources.id, contentSourceId))
    .limit(1);

  if (source.length === 0) {
    throw new FatalError(`Content source not found for generated content: ${generatedContentId}`);
  }

  return {
    id: source[0].id,
    extractedText: source[0].extractedText || source[0].rawInput || "",
    contextNote: source[0].contextNote,
    language: source[0].language,
  };
}

export async function generateContent(
  extractedText: string,
  contextNote: string | null,
  language: string
) {
  "use step";

  console.log(`Generating content in ${language}`);

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new FatalError("GOOGLE_GENERATIVE_AI_API_KEY is not set");
  }

  const languageName = language === "ko" ? "Korean" : "English";

  const { object } = await generateObject({
    model: google("gemini-2.5-flash"),
    system: `You are a professional content marketer. Generate engaging, structured content for multiple channels in ${languageName}.
    Create distinct content for each platform with appropriate tone and formatting.`,
    prompt: `Generate structured LinkedIn, blog, and newsletter content based on the following source material:

    Source text: ${extractedText}
    ${contextNote ? `Context note: ${contextNote}` : ""}`,
    schema: GeneratedContentSchema,
  });

  return object;
}

export async function storeGeneratedContent(
  contentSourceId: string,
  content: GeneratedContent,
  language: string
) {
  "use step";

  // Insert new generated_content record
  const [inserted] = await db
    .insert(generatedContent)
    .values({
      contentSourceId,
      generatedText: JSON.stringify(content),
      channelFormats: content,
      language,
      generationAttempt: 1,
      modelUsed: "gemini-2.5-flash",
      bannedPhraseHit: false,
    })
    .returning();

  // Create initial review status as awaiting_review
  await db.insert(reviewStatuses).values({
    generatedContentId: inserted.id,
    reviewedBy: null, // No reviewer yet
    status: "awaiting_review",
    reviewedAt: null,
  });

  console.log(
    `Stored regenerated content for source ${contentSourceId} (status: awaiting_review in review_statuses)`
  );
}

export async function notifyOperators() {
  "use step";

  // Use the shared notifyOperators function
  await notifyOps(
    "Content has been regenerated and is ready for your review. Please log in to the AIML system to review the updated content.",
    "Content Regenerated - Ready for Review"
  );
}
