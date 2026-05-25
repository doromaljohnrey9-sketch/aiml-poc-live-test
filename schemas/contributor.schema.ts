import { z } from "zod";

export const submitContentSchema = z.object({
  language: z.enum(["en", "ko"], {
    message: "Please select a language",
  }),
  inputType: z.enum(["url", "text"], {
    message: "Please select an input type",
  }),
  rawInput: z.string().min(1, "Content is required"),
  contextNote: z.string().optional(),
});

export type SubmitContentFormValues = z.infer<typeof submitContentSchema>;
