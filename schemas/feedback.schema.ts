import { z } from "zod";

const feedbackSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5, "Rating must be between 1 and 5"),
  message: z
    .string()
    .min(10, "Feedback must be at least 10 characters long")
    .max(500, "Feedback must be less than 500 characters"),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
export { feedbackSchema };
