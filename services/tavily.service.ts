import { tavily } from "@tavily/core";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

if (!TAVILY_API_KEY) {
  console.warn("TAVILY_API_KEY not set. Tavily extraction will be disabled.");
}

const tvly = TAVILY_API_KEY ? tavily({ apiKey: TAVILY_API_KEY }) : null;

export interface ExtractResult {
  url: string;
  rawContent: string;
}

export interface ExtractResponse {
  results: ExtractResult[];
  failedResults: Array<{ url: string; error: string }>;
}

export async function extractFromUrl(url: string): Promise<{
  extractedText: string;
  confidence?: number;
  error?: string;
}> {
  if (!tvly) {
    return {
      extractedText: "",
      error: "Tavily API key not configured",
    };
  }

  try {
    // Validate URL format
    try {
      new URL(url);
    } catch {
      return {
        extractedText: "",
        error: "Invalid URL format",
      };
    }

    const response = (await tvly.extract([url])) as ExtractResponse;

    if (response.results.length === 0) {
      return {
        extractedText: "",
        error: response.failedResults[0]?.error || "Failed to extract content",
      };
    }

    const result = response.results[0];
    return {
      extractedText: result.rawContent,
      confidence: 1, // Tavily doesn't provide confidence, default to 1
    };
  } catch (error) {
    console.error("Tavily extraction error:", error);
    return {
      extractedText: "",
      error: error instanceof Error ? error.message : "Failed to extract content",
    };
  }
}
