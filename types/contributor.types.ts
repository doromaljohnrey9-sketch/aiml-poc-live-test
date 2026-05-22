export type ContentSourceInput = {
  inputType: "url" | "text" | "document";
  rawInput: string;
  extractedText?: string;
  contextNote?: string;
  language: "en" | "ko";
};

export type ContentSource = {
  id: string;
  submittedBy: string | null;
  inputType: "url" | "text" | "document";
  rawInput: string | null;
  extractedText: string | null;
  contextNote: string | null;
  language: "en" | "ko";
  status: "pending" | "processing" | "processed" | "failed";
  createdAt: string;
  updatedAt: string;
};

export type PreviewScrapeInput = {
  url: string;
};

export type PreviewScrapeResult = {
  extractedText: string;
  confidence?: number;
  error?: string;
};
