import {
  fetchContentSource,
  generateContent,
  storeGeneratedContent,
  notifyOperators,
} from "./steps";

export async function aimlRegenerate(generatedContentId: string) {
  "use workflow";

  // Fetch the original content source
  const contentSource = await fetchContentSource(generatedContentId);

  // Regenerate content with the same language
  const regenerated = await generateContent(
    contentSource.extractedText,
    contentSource.contextNote,
    contentSource.language,
  );

  // Store the new generated content
  await storeGeneratedContent(contentSource.id, regenerated, contentSource.language);

  // Notify operators
  await notifyOperators();

  return {
    generatedContentId,
    status: "regenerated",
  };
}
