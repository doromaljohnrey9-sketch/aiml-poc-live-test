"use server";

import { db } from "@/lib/drizzle/db";
import { getSupabaseServer } from "@/lib/supabase/server";
import { feedback } from "@/drizzle/schemas";
import type { FeedbackFormValues } from "@/schemas/feedback.schema";

export async function submitFeedback(values: FeedbackFormValues): Promise<{ success: boolean; error?: string }> {
  const supabase = await getSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: false, error: "You must be logged in to submit feedback" };
  }

  try {
    await db.insert(feedback).values({
      userId: user.id,
      rating: values.rating,
      message: values.message,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    return { success: false, error: "Failed to submit feedback. Please try again." };
  }
}
