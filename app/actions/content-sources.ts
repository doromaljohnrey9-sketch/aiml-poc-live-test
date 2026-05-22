"use server";

import { requireRole } from "@/lib/guards/role.guard";
import { ROLES } from "@/drizzle/constants/roles-permissions.constant";
import { db } from "@/lib/drizzle/db";
import { contentSources } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";
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
    status: inserted.status as "pending" | "processing" | "processed" | "failed",
    createdAt: inserted.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: inserted.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function getMyContentSources(): Promise<ContentSource[]> {
  const user = await requireRole(ROLES.CONTRIBUTOR);

  const rows = await db
    .select()
    .from(contentSources)
    .where(eq(contentSources.submittedBy, user.id));

  return rows.map((row) => ({
    id: row.id,
    submittedBy: row.submittedBy,
    inputType: row.inputType as "url" | "text" | "document",
    rawInput: row.rawInput,
    extractedText: row.extractedText,
    contextNote: row.contextNote,
    language: row.language as "en" | "ko",
    status: row.status as "pending" | "processing" | "processed" | "failed",
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
  }));
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
    status: row.status as "pending" | "processing" | "processed" | "failed",
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function previewScrape(_input: PreviewScrapeInput): Promise<PreviewScrapeResult> {
  await requireRole(ROLES.CONTRIBUTOR);

  // TODO: Implement Tavily API call
  // - Validate URL format
  // - Call Tavily API to extract text
  // - Return { extractedText, confidence }
  // - Handle errors gracefully

  return {
    extractedText: "",
    error: "Tavily integration not yet implemented",
  };
}
