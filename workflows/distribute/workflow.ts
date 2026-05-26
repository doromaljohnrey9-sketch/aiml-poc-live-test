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
        // TODO: Enable LinkedIn distribution in V2 - currently disabled per PRD V1 scope
        // LinkedIn API integration pending OAuth setup and token management
        results[channel] = {
          status: "failed",
          error: "LinkedIn distribution disabled in V1 - coming in V2",
        };
      } else if (channel === "blog") {
        // TODO: Enable Blog distribution in V2 - currently disabled per PRD V1 scope
        // CMS integration (Sanity/Contentful) pending
        results[channel] = {
          status: "failed",
          error: "Blog distribution disabled in V1 - coming in V2",
        };
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
