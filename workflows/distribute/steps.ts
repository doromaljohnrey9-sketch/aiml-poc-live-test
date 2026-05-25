import { FatalError } from "workflow";
import { db } from "@/lib/drizzle/db";
import { generatedContent } from "@/drizzle/schemas/generated-content/generated-content.schema";
import { blogPosts } from "@/drizzle/schemas/blog-posts/blog-posts.schema";
import { distributionLogs } from "@/drizzle/schemas/distribution-logs/distribution-logs.schema";
import { contentSources } from "@/drizzle/schemas/content-sources/content-sources.schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const RESEND_EMAIL_FROM = process.env.RESEND_EMAIL_FROM;

export async function formatContentForChannels(generatedContentId: string) {
  "use step";

  // Fetch generated_content by ID
  const content = await db
    .select()
    .from(generatedContent)
    .where(eq(generatedContent.id, generatedContentId))
    .limit(1);

  if (content.length === 0) {
    throw new FatalError(`Generated content not found: ${generatedContentId}`);
  }

  // Return channel formats from the generated_content
  const channelFormats = content[0].channelFormats as {
    linkedin?: string;
    blog?: string;
    newsletter?: string;
  } | null;

  return {
    linkedin: channelFormats?.linkedin || "",
    blog: channelFormats?.blog || "",
    newsletter: channelFormats?.newsletter || "",
  };
}

export async function publishToLinkedIn(content: string) {
  "use step";
  // TODO: Call LinkedIn API
  // This will be implemented when LinkedIn API integration is set up
  console.log("Publishing to LinkedIn");
  return { postId: "linkedin-post-123" };
}

export async function publishToBlog(content: string, generatedContentId: string) {
  "use step";

  // Generate slug from content (simplified - in production use proper slug generation)
  const slug = `blog-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Extract title from content (first line or first 50 chars)
  const title = content.split("\n")[0].substring(0, 100) || "Blog Post";

  // Store in blog_posts table
  await db.insert(blogPosts).values({
    generatedContentId,
    title,
    slug,
    content,
    status: "published",
    publishedAt: new Date(),
  });

  console.log("Publishing to Blog");
  return { slug };
}

export async function publishToNewsletter(content: string) {
  "use step";

  if (!resend || !RESEND_EMAIL_FROM) {
    console.warn("RESEND_API_KEY or RESEND_EMAIL_FROM not set. Newsletter publishing disabled.");
    return { messageId: null };
  }

  // TODO: Fetch subscriber list from system config or separate table
  // For now, using a placeholder recipient
  const recipient = process.env.NEWSLETTER_RECIPIENT || "newsletter@example.com";

  try {
    const response = await resend.emails.send({
      from: RESEND_EMAIL_FROM,
      to: recipient,
      subject: "Latest Updates from AIML",
      html: content,
    });

    console.log("Publishing to Newsletter");

    // Handle response which might be an error or success
    if ("error" in response) {
      throw new FatalError(`Resend API error: ${response.error?.message || "Unknown error"}`);
    }

    // Type assertion for the success case
    const messageId = (response as { id?: string }).id;
    return { messageId: messageId || null };
  } catch (error) {
    console.error("Failed to send newsletter:", error);
    throw new FatalError(
      `Failed to send newsletter: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function logDistribution(
  generatedContentId: string,
  channels: string[],
  results: Record<string, any>
) {
  "use step";

  // Create distribution_logs records for each channel
  for (const channel of channels) {
    const result = results[channel];
    const status = result?.status === "success" ? "success" : "failed";

    await db.insert(distributionLogs).values({
      generatedContentId,
      channel,
      status,
      publishedAt: status === "success" ? new Date() : null,
      externalPostId: result?.externalId || null,
      errorMessage: result?.error || null,
    });
  }

  console.log(`Logging distribution for content ${generatedContentId}`, results);
}

export async function markSourceAsDistributed(generatedContentId: string) {
  "use step";

  // Fetch the content source ID from generated content
  const content = await db
    .select({ contentSourceId: generatedContent.contentSourceId })
    .from(generatedContent)
    .where(eq(generatedContent.id, generatedContentId))
    .limit(1);

  if (content.length === 0) {
    throw new FatalError(`Generated content ${generatedContentId} not found`);
  }

  const contentSourceId = content[0].contentSourceId;
  if (!contentSourceId) {
    throw new FatalError(`Generated content ${generatedContentId} has no content source`);
  }

  // Update content_sources status to 'distributed'
  await db
    .update(contentSources)
    .set({ status: "distributed" })
    .where(eq(contentSources.id, contentSourceId));

  console.log(`Marked source ${contentSourceId} as distributed`);
}
