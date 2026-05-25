import { FatalError } from "workflow";
import { db } from "@/lib/drizzle/db";
import { systemConfig } from "@/drizzle/schemas/system-config/system-config.schema";
import { contentSources } from "@/drizzle/schemas/content-sources/content-sources.schema";
import { generatedContent } from "@/drizzle/schemas/generated-content/generated-content.schema";
import { reviewStatuses } from "@/drizzle/schemas/review-statuses/review-statuses.schema";
import { auditLogs } from "@/drizzle/schemas/audit-logs/audit-logs.schema";
import { eq } from "drizzle-orm";
import { notifyOperators as notifyOps } from "../shared/notifyOperators";
import { extractFromUrl } from "@/services/tavily.service";

export async function fetchLoopConfig() {
  "use step";

  // Read configuration from system_config table
  const configs = await db.select().from(systemConfig);

  const configMap = new Map(configs.map((c) => [c.key, c.value]));

  return {
    weeklyLoopEnabled: configMap.get("weekly_loop_enabled") === "true",
    loopDay: configMap.get("loop_day") || "monday",
    loopTime: configMap.get("loop_time") || "09:00",
    supportedLanguages: (configMap.get("supported_languages") || "en,ko")
      .split(",")
      .map((l) => l.trim()),
    lastRun: configMap.get("last_run") || null,
    nextRun: configMap.get("next_run") || null,
    itemsProcessed: parseInt(configMap.get("items_processed") || "0", 10),
  };
}

export async function fetchPendingSources() {
  "use step";

  // Query content_sources where status = 'pending'
  const sources = await db
    .select()
    .from(contentSources)
    .where(eq(contentSources.status, "pending"));

  return sources;
}

export async function notifyOperators() {
  "use step";

  // Use the shared notifyOperators function
  await notifyOps(
    "New AI-generated content is ready for your review. Please log in to the AIML system to review and approve the content.",
    "Content Ready for Review"
  );
}

export async function logWorkflowExecution(workflowName: string) {
  "use step";

  // Create audit log entry
  await db.insert(auditLogs).values({
    action: "workflow_execution",
    entityType: "workflow",
    entityId: crypto.randomUUID(),
    payload: {
      workflowName,
      timestamp: new Date().toISOString(),
    },
  });

  console.log(`Workflow execution logged: ${workflowName}`);
}

export async function scrapeIfUrl(source: any) {
  "use step";

  // If input type is URL and not already scraped, use Tavily
  if (source.inputType === "url" && !source.extractedText) {
    const result = await extractFromUrl(source.rawInput);

    if (result.error) {
      throw new FatalError(`Failed to scrape URL: ${result.error}`);
    }

    // Update the source with extracted text
    await db
      .update(contentSources)
      .set({ extractedText: result.extractedText })
      .where(eq(contentSources.id, source.id));

    return result.extractedText;
  }

  // Return existing extracted text or raw input
  return source.extractedText || source.rawInput || "";
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

  // Insert new generated_content record
  const [inserted] = await db
    .insert(generatedContent)
    .values({
      contentSourceId,
      generatedText: JSON.stringify(content),
      channelFormats: content,
      language,
      generationAttempt: 1,
      modelUsed: "gpt-4",
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
    `Stored generated content for source ${contentSourceId} (status: awaiting_review in review_statuses)`
  );
}

export async function markSourceContentGenerated(contentSourceId: string) {
  "use step";

  // Update content_sources status to 'content_generated'
  await db
    .update(contentSources)
    .set({ status: "content_generated" })
    .where(eq(contentSources.id, contentSourceId));

  console.log(`Marked source ${contentSourceId} as content_generated`);
}

export async function markSourceDistributed(contentSourceId: string) {
  "use step";

  // Update content_sources status to 'distributed'
  await db
    .update(contentSources)
    .set({ status: "distributed" })
    .where(eq(contentSources.id, contentSourceId));

  console.log(`Marked source ${contentSourceId} as distributed`);
}
