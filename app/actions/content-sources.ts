"use server";

import { requireRole } from "@/lib/guards/role.guard";
import { ROLES } from "@/drizzle/constants/roles-permissions.constant";
import { db } from "@/lib/drizzle/db";
import { contentSources } from "@/drizzle/schemas";
import { eq, count } from "drizzle-orm";
import { extractFromUrl } from "@/services/tavily.service";
import type {
  ContentSource,
  ContentSourceInput,
  PreviewScrapeInput,
  PreviewScrapeResult,
} from "@/types/contributor.types";

export async function createContentSource(input: ContentSourceInput): Promise<ContentSource> {
  const user = await requireRole(ROLES.CONTRIBUTOR);

  // Validate required fields
  if (!input.inputType || !input.rawInput || !input.language) {
    throw new Error("Missing required fields: inputType, rawInput, language");
  }

  if (!["url", "text", "document"].includes(input.inputType)) {
    throw new Error("Invalid input type");
  }

  if (!["en", "ko"].includes(input.language)) {
    throw new Error("Invalid language");
  }

  const [inserted] = await db
    .insert(contentSources)
    .values({
      submittedBy: user.id,
      inputType: input.inputType,
      rawInput: input.rawInput,
      extractedText: input.extractedText || null,
      contextNote: input.contextNote || null,
      language: input.language,
      status: "pending",
    })
    .returning();

  return {
    id: inserted.id,
    submittedBy: inserted.submittedBy,
    inputType: inserted.inputType as "url" | "text" | "document",
    rawInput: inserted.rawInput,
    extractedText: inserted.extractedText,
    contextNote: inserted.contextNote,
    language: inserted.language as "en" | "ko",
    status: inserted.status as "pending" | "processing" | "processed" | "distributed" | "failed",
    createdAt: inserted.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: inserted.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function getMyContentSources(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  language?: string;
}): Promise<{ data: ContentSource[]; total: number }> {
  const user = await requireRole(ROLES.CONTRIBUTOR);

  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const offset = (page - 1) * pageSize;

  // Build where conditions
  const conditions = [eq(contentSources.submittedBy, user.id)];

  if (params?.status && params.status !== "all") {
    conditions.push(eq(contentSources.status, params.status));
  }

  if (params?.language && params.language !== "all") {
    conditions.push(eq(contentSources.language, params.language));
  }

  // Get total count
  const [{ value: totalCount }] = await db
    .select({ value: count() })
    .from(contentSources)
    .where(eq(contentSources.submittedBy, user.id));

  // Get paginated data
  const rows = await db
    .select()
    .from(contentSources)
    .where(eq(contentSources.submittedBy, user.id))
    .limit(pageSize)
    .offset(offset)
    .orderBy(contentSources.createdAt);

  // Apply client-side filtering for search (simplified for PoC)
  let filteredRows = rows;
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredRows = rows.filter(
      (row) =>
        row.rawInput?.toLowerCase().includes(searchLower) ||
        row.contextNote?.toLowerCase().includes(searchLower)
    );
  }

  // Apply client-side filtering for status and language (simplified for PoC)
  if (params?.status && params.status !== "all") {
    filteredRows = filteredRows.filter((row) => row.status === params.status);
  }

  if (params?.language && params.language !== "all") {
    filteredRows = filteredRows.filter((row) => row.language === params.language);
  }

  return {
    data: filteredRows.map((row) => ({
      id: row.id,
      submittedBy: row.submittedBy,
      inputType: row.inputType as "url" | "text" | "document",
      rawInput: row.rawInput,
      extractedText: row.extractedText,
      contextNote: row.contextNote,
      language: row.language as "en" | "ko",
      status: row.status as "pending" | "processing" | "processed" | "distributed" | "failed",
      createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
    })),
    total: Number(totalCount) || 0,
  };
}

export async function getContentSourceDetail(id: string): Promise<ContentSource | null> {
  const user = await requireRole(ROLES.CONTRIBUTOR);

  const [row] = await db
    .select()
    .from(contentSources)
    .where(eq(contentSources.id, id) && eq(contentSources.submittedBy, user.id));

  if (!row) return null;

  return {
    id: row.id,
    submittedBy: row.submittedBy,
    inputType: row.inputType as "url" | "text" | "document",
    rawInput: row.rawInput,
    extractedText: row.extractedText,
    contextNote: row.contextNote,
    language: row.language as "en" | "ko",
    status: row.status as "pending" | "processing" | "processed" | "distributed" | "failed",
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function previewScrape(input: PreviewScrapeInput): Promise<PreviewScrapeResult> {
  await requireRole(ROLES.CONTRIBUTOR);

  const result = await extractFromUrl(input.url);

  return result;
}
