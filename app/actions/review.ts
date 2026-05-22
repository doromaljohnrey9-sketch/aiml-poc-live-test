"use server";

import { db } from "@/lib/drizzle/db";
import { requireRole } from "@/lib/guards/role.guard";
import { ROLES } from "@/drizzle/constants/roles-permissions.constant";
import { generatedContent, contentSources, reviewStatuses, profiles } from "@/drizzle/schemas";
import { eq, desc } from "drizzle-orm";

import type { ReviewInput } from "@/types/review.types";

const toISOString = (value: Date | string | null | undefined): string | null =>
  value instanceof Date ? value.toISOString() : (value ?? null);

export async function getAwaitingReview(page = 1, pageSize = 20) {
  await requireRole(ROLES.OPERATOR);

  const offset = (page - 1) * pageSize;

  const rows = await db
    .select({
      id: generatedContent.id,
      contentSourceId: generatedContent.contentSourceId,
      language: generatedContent.language,
      generationAttempt: generatedContent.generationAttempt,
      createdAt: generatedContent.createdAt,
      channelFormats: generatedContent.channelFormats,
      submittedBy: contentSources.submittedBy,
      submittedByName: profiles.name,
    })
    .from(generatedContent)
    .leftJoin(contentSources, eq(generatedContent.contentSourceId, contentSources.id))
    .leftJoin(profiles, eq(contentSources.submittedBy, profiles.id))
    .leftJoin(reviewStatuses, eq(generatedContent.id, reviewStatuses.generatedContentId))
    .where(eq(reviewStatuses.status, "awaiting_review"))
    .orderBy(desc(generatedContent.createdAt))
    .limit(pageSize)
    .offset(offset);

  return rows.map((row) => ({
    id: row.id,
    contentSourceId: row.contentSourceId,
    language: row.language,
    generationAttempt: Number(row.generationAttempt ?? 1),
    createdAt: toISOString(row.createdAt),
    channelFormats: row.channelFormats ?? null,
    submittedBy: row.submittedBy ?? null,
    submittedByName: row.submittedByName ?? null,
  }));
}

export async function getGeneratedContentDetail(id: string) {
  await requireRole(ROLES.OPERATOR);

  const [gcRow] = await db
    .select({
      id: generatedContent.id,
      contentSourceId: generatedContent.contentSourceId,
      generatedText: generatedContent.generatedText,
      channelFormats: generatedContent.channelFormats,
      language: generatedContent.language,
      generationAttempt: generatedContent.generationAttempt,
      createdAt: generatedContent.createdAt,
    })
    .from(generatedContent)
    .where(eq(generatedContent.id, id))
    .limit(1);

  if (!gcRow) return null;

  let sourceRow = null;

  if (gcRow.contentSourceId) {
    const [sr] = await db
      .select({
        id: contentSources.id,
        submittedBy: contentSources.submittedBy,
        rawInput: contentSources.rawInput,
        extractedText: contentSources.extractedText,
        contextNote: contentSources.contextNote,
        language: contentSources.language,
      })
      .from(contentSources)
      .where(eq(contentSources.id, gcRow.contentSourceId))
      .limit(1);

    sourceRow = sr ?? null;
  }

  const reviewRows = await db
    .select({
      id: reviewStatuses.id,
      reviewedBy: reviewStatuses.reviewedBy,
      reviewedByName: profiles.name,
      status: reviewStatuses.status,
      checkboxFactual: reviewStatuses.checkboxFactual,
      checkboxNdaSafe: reviewStatuses.checkboxNdaSafe,
      checkboxTone: reviewStatuses.checkboxTone,
      rejectionReason: reviewStatuses.rejectionReason,
      reviewedAt: reviewStatuses.reviewedAt,
    })
    .from(reviewStatuses)
    .leftJoin(profiles, eq(reviewStatuses.reviewedBy, profiles.id))
    .where(eq(reviewStatuses.generatedContentId, id))
    .orderBy(desc(reviewStatuses.reviewedAt));

  return {
    id: gcRow.id,
    contentSourceId: gcRow.contentSourceId,
    generatedText: gcRow.generatedText,
    channelFormats: gcRow.channelFormats ?? null,
    language: gcRow.language,
    generationAttempt: Number(gcRow.generationAttempt ?? 1),
    createdAt: toISOString(gcRow.createdAt),
    contentSource: sourceRow
      ? {
          id: sourceRow.id,
          submittedBy: sourceRow.submittedBy,
          rawInput: sourceRow.rawInput,
          extractedText: sourceRow.extractedText,
          contextNote: sourceRow.contextNote,
          language: sourceRow.language,
        }
      : null,
    reviews: reviewRows.map((r) => ({
      id: r.id,
      reviewedBy: r.reviewedBy,
      reviewedByName: r.reviewedByName,
      status: r.status,
      checkboxFactual: r.checkboxFactual,
      checkboxNdaSafe: r.checkboxNdaSafe,
      checkboxTone: r.checkboxTone,
      rejectionReason: r.rejectionReason,
      reviewedAt: toISOString(r.reviewedAt),
    })),
  };
}

export async function submitReview(input: ReviewInput) {
  const user = await requireRole(ROLES.OPERATOR);

  const [inserted] = await db
    .insert(reviewStatuses)
    .values({
      generatedContentId: input.generated_content_id,
      reviewedBy: user.id,
      status: input.status,
      checkboxFactual: input.checkbox_factual ?? null,
      checkboxNdaSafe: input.checkbox_nda_safe ?? null,
      checkboxTone: input.checkbox_tone ?? null,
      rejectionReason: input.rejection_reason ?? null,
      reviewedAt: new Date(),
    })
    .returning();

  // TODO: If rejected -> start aimlRegenerate workflow (Vercel Workflows)

  return {
    id: inserted.id,
    generatedContentId: inserted.generatedContentId,
    reviewedBy: inserted.reviewedBy,
    status: inserted.status,
  };
}
