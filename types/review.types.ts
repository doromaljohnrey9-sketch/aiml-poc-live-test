export type ReviewInput = {
  generated_content_id: string;
  status: "approved" | "rejected";
  checkbox_factual?: boolean | null;
  checkbox_nda_safe?: boolean | null;
  checkbox_tone?: boolean | null;
  rejection_reason?: string | null;
};
