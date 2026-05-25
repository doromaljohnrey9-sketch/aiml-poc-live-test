import { FatalError } from "workflow";
import { db } from "@/lib/drizzle/db";
import { generatedContent } from "@/drizzle/schemas/generated-content/generated-content.schema";
import { contentSources } from "@/drizzle/schemas/content-sources/content-sources.schema";
import { eq } from "drizzle-orm";
import { notifyOperators as notifyOps } from "../shared/notifyOperators";

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

  // Mock AI generation - simulates GPT-4 response
  const mockContent = {
    linkedin:
      language === "ko"
        ? `AI 생성 콘텐츠 - ${extractedText.substring(0, 50)}... 기반 링크드인 게시물입니다.`
        : `AI-generated content - LinkedIn post based on: ${extractedText.substring(0, 50)}...`,
    blog:
      language === "ko"
        ? `AI 생성 콘텐츠 - ${extractedText.substring(0, 50)}... 기반 블로그 게시물입니다. 이것은 테스트용 모의 데이터입니다.`
        : `AI-generated content - Blog post based on: ${extractedText.substring(0, 50)}... This is mock data for testing.`,
    newsletter:
      language === "ko"
        ? `AI 생성 콘텐츠 - ${extractedText.substring(0, 50)}... 기반 뉴스레터입니다.`
        : `AI-generated content - Newsletter based on: ${extractedText.substring(0, 50)}...`,
  };

  return mockContent;
}

export async function storeGeneratedContent(
  contentSourceId: string,
  content: { linkedin: string; blog: string; newsletter: string },
  language: string
) {
  "use step";

  // Insert new generated_content record with status: awaiting_review
  await db.insert(generatedContent).values({
    contentSourceId,
    generatedText: JSON.stringify(content),
    channelFormats: content,
    language,
    status: "awaiting_review",
    generationAttempt: 1,
    modelUsed: "gpt-4",
    bannedPhraseHit: false,
  });

  console.log(`Stored regenerated content for source ${contentSourceId} (status: awaiting_review)`);
}

export async function notifyOperators() {
  "use step";

  // Use the shared notifyOperators function
  await notifyOps(
    "Content has been regenerated and is ready for your review. Please log in to the AIML system to review the updated content.",
    "Content Regenerated - Ready for Review"
  );
}
