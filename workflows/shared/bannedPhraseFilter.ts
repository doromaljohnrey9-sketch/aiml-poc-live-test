import { FatalError } from "workflow";
import { db } from "@/lib/drizzle/db";
import { bannedPhrases } from "@/drizzle/schemas/banned-phrases/banned-phrases.schema";

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
) {
  "use step";

  // Check max retry attempts (0-indexed, so attempt 2 means 3 tries total)
  if (attempt >= 2) {
    throw new FatalError(
      "Max regeneration attempts reached - content still contains banned phrases"
    );
  }

  console.log(`Regenerating content (attempt ${attempt + 1}) avoiding phrases:`, bannedPhrases);

  // Mock AI generation - simulates GPT-4 response with banned phrases avoided
  const mockContent = {
    linkedin:
      language === "ko"
        ? "AI 생성 콘텐츠 - 금지된 구문을 피한 링크드인 게시물입니다."
        : "AI-generated content - LinkedIn post avoiding banned phrases.",
    blog:
      language === "ko"
        ? "AI 생성 콘텐츠 - 금지된 구문을 피한 블로그 게시물입니다. 이것은 테스트용 모의 데이터입니다."
        : "AI-generated content - Blog post avoiding banned phrases. This is mock data for testing.",
    newsletter:
      language === "ko"
        ? "AI 생성 콘텐츠 - 금지된 구문을 피한 뉴스레터입니다."
        : "AI-generated content - Newsletter avoiding banned phrases.",
  };

  return mockContent;
}
