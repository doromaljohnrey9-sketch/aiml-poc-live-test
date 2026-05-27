import { FatalError } from "workflow";
import { db } from "@/lib/drizzle/db";
import { bannedPhrases } from "@/drizzle/schemas/banned-phrases/banned-phrases.schema";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { GeneratedContentSchema, type GeneratedContent } from "./contentSchemas";

export async function runBannedPhraseFilter(generatedText: string) {
  "use step";

  // Load all banned phrases from database
  const phrases = await db.select({ phrase: bannedPhrases.phrase }).from(bannedPhrases);

  // Scan generated text for matches (case-insensitive)
  const lowerText = generatedText.toLowerCase();
  const detectedPhrases: string[] = [];

  for (const { phrase } of phrases) {
    if (lowerText.includes(phrase.toLowerCase())) {
      detectedPhrases.push(phrase);
    }
  }

  console.log(`Banned phrase filter: found ${detectedPhrases.length} matches`);

  return {
    hasBannedPhrases: detectedPhrases.length > 0,
    detectedPhrases,
  };
}

export async function regenerateWithBannedPhrases(
  originalText: string,
  contextNote: string | null,
  language: string,
  bannedPhrases: string[],
  attempt: number
): Promise<GeneratedContent> {
  "use step";

  // Note: Max retry check is now handled in the workflow, not here
  // This function will be called by the workflow which controls the retry logic

  console.log(`Regenerating content (attempt ${attempt + 1}) avoiding phrases:`, bannedPhrases);

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new FatalError("GOOGLE_GENERATIVE_AI_API_KEY is not set");
  }

  const languageName = language === "ko" ? "Korean" : "English";

  const { object } = await generateObject({
    model: google("gemini-2.5-flash"),
    system: `You are a professional content marketer. Generate engaging, structured content for multiple channels in ${languageName}.
    STRICTLY AVOID these phrases: ${bannedPhrases.join(", ")}.
    Create distinct content for each platform with appropriate tone and formatting.`,
    prompt: `Regenerate structured LinkedIn, blog, and newsletter content based on the following source material, avoiding the banned phrases:

    Source text: ${originalText}
    ${contextNote ? `Context note: ${contextNote}` : ""}

    Banned phrases to avoid: ${bannedPhrases.join(", ")}`,
    schema: GeneratedContentSchema,
  });

  return object;
}
