"use server";

import { db } from "@/lib/drizzle/db";
import { requireRole } from "@/lib/guards/role.guard";
import { ROLES } from "@/drizzle/constants/roles-permissions.constant";
import { generatedContent, contentSources, reviewStatuses, profiles } from "@/drizzle/schemas";
import { eq, desc, and, count } from "drizzle-orm";

import type { ReviewInput } from "@/types/review.types";

const toISOString = (value: Date | string | null | undefined): string | null =>
  value instanceof Date ? value.toISOString() : (value ?? null);

export async function getAwaitingReview(
  page = 1,
  pageSize = 20,
  search?: string,
  status?: string,
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
  const conditions = [eq(latestReviewSubquery.status, "awaiting_review")];

  if (status && status !== "all") {
    conditions.push(eq(latestReviewSubquery.status, status));
  }

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
    .leftJoin(contentSources, eq(generatedContent.contentSourceId, contentSources.id))
    .leftJoin(profiles, eq(contentSources.submittedBy, profiles.id))
    .where(and(...conditions));

  const total = Number(countResult[0]?.count ?? 0);

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
    .innerJoin(
      latestReviewSubquery,
      eq(generatedContent.id, latestReviewSubquery.generatedContentId)
    )
    .leftJoin(contentSources, eq(generatedContent.contentSourceId, contentSources.id))
    .leftJoin(profiles, eq(contentSources.submittedBy, profiles.id))
    .where(and(...conditions))
    .orderBy(desc(generatedContent.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    data: rows.map((row) => ({
      id: row.id,
      contentSourceId: row.contentSourceId,
      language: row.language,
      generationAttempt: Number(row.generationAttempt ?? 1),
      createdAt: toISOString(row.createdAt),
      channelFormats:
        (row.channelFormats as { linkedin: string; blog: string; newsletter: string } | null) ??
        null,
      submittedBy: row.submittedBy ?? null,
      submittedByName: row.submittedByName ?? null,
    })),
    total,
  };
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
    channelFormats:
      (gcRow.channelFormats as { linkedin: string; blog: string; newsletter: string } | null) ??
      null,
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

  // Update the existing awaiting_review review instead of inserting a new one
  const [updated] = await db
    .update(reviewStatuses)
    .set({
      status: input.status,
      reviewedBy: user.id,
      checkboxFactual: input.checkbox_factual ?? null,
      checkboxNdaSafe: input.checkbox_nda_safe ?? null,
      checkboxTone: input.checkbox_tone ?? null,
      rejectionReason: input.rejection_reason ?? null,
      reviewedAt: new Date(),
    })
    .where(
      and(
        eq(reviewStatuses.generatedContentId, input.generated_content_id),
        eq(reviewStatuses.status, "awaiting_review")
      )
    )
    .returning();

  if (!updated) {
    throw new Error("Review not found or already reviewed");
  }

  // If rejected, trigger the regenerate workflow asynchronously
  if (input.status === "rejected") {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const workflowSecret = process.env.WORKFLOW_SECRET;

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add authorization if WORKFLOW_SECRET is set
      if (workflowSecret) {
        headers["Authorization"] = `Bearer ${workflowSecret}`;
      }

      await fetch(`${baseUrl}/api/workflows/regenerate`, {
        method: "POST",
        headers,
        body: JSON.stringify({ generatedContentId: input.generated_content_id }),
      });
    } catch (error) {
      console.error("Failed to trigger regenerate workflow:", error);
      // Don't throw - the review was successful even if workflow trigger failed
    }
  }

  return {
    id: updated.id,
    generatedContentId: updated.generatedContentId,
    reviewedBy: updated.reviewedBy,
    status: updated.status,
  };
}
