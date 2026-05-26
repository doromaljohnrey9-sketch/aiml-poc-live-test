"use server";

import { db } from "@/lib/drizzle/db";
import { requireRole } from "@/lib/guards/role.guard";
import { ROLES } from "@/drizzle/constants/roles-permissions.constant";
import { distributionLogs, generatedContent, reviewStatuses } from "@/drizzle/schemas";
import { eq, desc, and, count } from "drizzle-orm";

const toISOString = (value: Date | string | null | undefined): string | null =>
  value instanceof Date ? value.toISOString() : (value ?? null);

export async function getApprovedContent(
  page = 1,
  pageSize = 20,
  search?: string,
  language?: string
) {
  await requireRole(ROLES.OPERATOR);

  const offset = (page - 1) * pageSize;

  // Subquery to get the latest review status for each generated content
  const latestReviewSubquery = db
    .select({
      generatedContentId: reviewStatuses.generatedContentId,
      status: reviewStatuses.status,
      reviewedAt: reviewStatuses.reviewedAt,
    })
    .from(reviewStatuses)
    .orderBy(desc(reviewStatuses.reviewedAt))
    .as("latest_review");

  // Build where conditions
  const conditions = [eq(latestReviewSubquery.status, "approved")];

  if (language && language !== "all") {
    conditions.push(eq(generatedContent.language, language));
  }

  // Count query for total
  const countResult = await db
    .select({ count: count() })
    .from(generatedContent)
    .innerJoin(
      latestReviewSubquery,
      eq(generatedContent.id, latestReviewSubquery.generatedContentId)
    )
    .leftJoin(distributionLogs, eq(generatedContent.id, distributionLogs.generatedContentId))
    .where(and(...conditions));

  const total = Number(countResult[0]?.count ?? 0);

  const rows = await db
    .select({
      id: generatedContent.id,
      contentSourceId: generatedContent.contentSourceId,
      channelFormats: generatedContent.channelFormats,
      language: generatedContent.language,
      generationAttempt: generatedContent.generationAttempt,
      createdAt: generatedContent.createdAt,
    })
    .from(generatedContent)
    .innerJoin(
      latestReviewSubquery,
      eq(generatedContent.id, latestReviewSubquery.generatedContentId)
    )
    .leftJoin(distributionLogs, eq(generatedContent.id, distributionLogs.generatedContentId))
    .where(and(...conditions))
    .orderBy(desc(generatedContent.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    data: rows.map((row) => ({
      id: row.id,
      contentSourceId: row.contentSourceId,
      channelFormats:
        (row.channelFormats as {
          linkedin: string;
          blog: string;
          newsletter: string;
        } | null) ?? null,
      language: row.language,
      generationAttempt: Number(row.generationAttempt ?? 1),
      createdAt: toISOString(row.createdAt),
    })),
    total,
  };
}

export async function getDistributionLogs(
  page = 1,
  pageSize = 20,
  search?: string,
  status?: string,
  channel?: string,
  generatedContentId?: string
) {
  await requireRole(ROLES.OPERATOR);

  const offset = (page - 1) * pageSize;

  // Build where conditions
  const conditions: any[] = [];

  if (generatedContentId) {
    conditions.push(eq(distributionLogs.generatedContentId, generatedContentId));
  }

  if (status && status !== "all") {
    conditions.push(eq(distributionLogs.status, status));
  }

  if (channel && channel !== "all") {
    conditions.push(eq(distributionLogs.channel, channel));
  }

  // Count query for total
  const countResult = await db
    .select({ count: count() })
    .from(distributionLogs)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const total = Number(countResult[0]?.count ?? 0);

  const rows = await db
    .select({
      id: distributionLogs.id,
      generatedContentId: distributionLogs.generatedContentId,
      channel: distributionLogs.channel,
      status: distributionLogs.status,
      scheduledAt: distributionLogs.scheduledAt,
      publishedAt: distributionLogs.publishedAt,
      externalPostId: distributionLogs.externalPostId,
      errorMessage: distributionLogs.errorMessage,
      createdAt: distributionLogs.createdAt,
      updatedAt: distributionLogs.updatedAt,
    })
    .from(distributionLogs)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(distributionLogs.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    data: rows.map((r) => ({
      id: r.id,
      generatedContentId: r.generatedContentId,
      channel: r.channel,
      status: r.status,
      scheduledAt: toISOString(r.scheduledAt),
      publishedAt: toISOString(r.publishedAt),
      externalPostId: r.externalPostId,
      errorMessage: r.errorMessage,
      createdAt: toISOString(r.createdAt),
      updatedAt: toISOString(r.updatedAt),
    })),
    total,
  };
}

export async function publishContent(input: {
  generated_content_id: string;
  channels: string[];
  scheduled_at?: string | null;
}) {
  const user = await requireRole(ROLES.OPERATOR);

  // TODO: Check emergency stop in system_config and block if active

  // Filter out disabled channels (LinkedIn and Blog are V2 features)
  // Only newsletter is active in V1 per PRD
  const activeChannels = input.channels.filter((channel) => channel === "newsletter");

  if (activeChannels.length === 0) {
    throw new Error("No active channels selected. Only newsletter is available in V1.");
  }

  const entries = activeChannels.map((channel) => ({
    generatedContentId: input.generated_content_id,
    channel,
    status: "pending",
    scheduledAt: input.scheduled_at ? new Date(input.scheduled_at) : null,
  }));

  const inserted = await db.insert(distributionLogs).values(entries).returning();

  // TODO: Trigger aimlDistribute workflow for immediate publish when scheduled_at is null

  return inserted.map((i) => ({
    id: i.id,
    generatedContentId: i.generatedContentId,
    channel: i.channel,
    status: i.status,
    scheduledAt: i.scheduledAt?.toISOString() ?? null,
    createdAt: i.createdAt?.toISOString() ?? null,
  }));
}
