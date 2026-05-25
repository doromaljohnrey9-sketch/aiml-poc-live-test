"use server";

import { db } from "@/lib/drizzle/db";
import { requireRole } from "@/lib/guards/role.guard";
import { ROLES } from "@/drizzle/constants/roles-permissions.constant";
import { distributionLogs, generatedContent, reviewStatuses } from "@/drizzle/schemas";
import { eq, desc, and } from "drizzle-orm";

const toISOString = (value: Date | string | null | undefined): string | null =>
  value instanceof Date ? value.toISOString() : (value ?? null);

export async function getApprovedContent(page = 1, pageSize = 20) {
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
    .where(eq(latestReviewSubquery.status, "approved"))
    .orderBy(desc(generatedContent.createdAt))
    .limit(pageSize)
    .offset(offset);

  return rows.map((row) => ({
    id: row.id,
    contentSourceId: row.contentSourceId,
    channelFormats: row.channelFormats ?? null,
    language: row.language,
    generationAttempt: Number(row.generationAttempt ?? 1),
    createdAt: toISOString(row.createdAt),
  }));
}

export async function getDistributionLogs(generatedContentId?: string) {
  await requireRole(ROLES.OPERATOR);

  const q = db
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
    .orderBy(desc(distributionLogs.createdAt));

  if (generatedContentId) {
    q.where(eq(distributionLogs.generatedContentId, generatedContentId));
  }

  const rows = await q;

  return rows.map((r) => ({
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
  }));
}

export async function publishContent(input: {
  generated_content_id: string;
  channels: string[];
  scheduled_at?: string | null;
}) {
  const user = await requireRole(ROLES.OPERATOR);

  // TODO: Check emergency stop in system_config and block if active

  const entries = input.channels.map((channel) => ({
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
