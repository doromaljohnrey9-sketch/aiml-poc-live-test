import {
  formatContentForChannels,
  publishToLinkedIn,
  publishToBlog,
  publishToNewsletter,
  logDistribution,
  markSourceAsDistributed,
} from "./steps";

export async function aimlDistribute(generatedContentId: string, channels: string[]) {
  "use workflow";

  const content = await formatContentForChannels(generatedContentId);

  const results: Record<string, { status: string; externalId?: string; error?: string }> = {};

  for (const channel of channels) {
    try {
      if (channel === "linkedin") {
        const result = await publishToLinkedIn(content.linkedin);
        results[channel] = { status: "success", externalId: result.postId };
      } else if (channel === "blog") {
        const result = await publishToBlog(content.blog, generatedContentId);
        results[channel] = { status: "success", externalId: result.slug };
      } else if (channel === "newsletter") {
        const result = await publishToNewsletter(content.newsletter);
        results[channel] = { status: "success", externalId: result.messageId || undefined };
      }
    } catch (error) {
      results[channel] = {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  await logDistribution(generatedContentId, channels, results);

  // Mark source as distributed after successful distribution
  await markSourceAsDistributed(generatedContentId);

  return {
    generatedContentId,
    results,
  };
}
