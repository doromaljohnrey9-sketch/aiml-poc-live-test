"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitFeedback } from "@/app/actions/feedback";
import { getQueryKey } from "@/lib/query/get-query-keys";
import type { FeedbackFormValues } from "@/schemas/feedback.schema";

export function useFeedback() {
  const queryClient = useQueryClient();

  const submitFeedbackMutation = useMutation({
    mutationFn: (values: FeedbackFormValues) => submitFeedback(values),
    onSuccess: () => {
      // Invalidate feedback queries if we add them later
      queryClient.invalidateQueries({ queryKey: getQueryKey.feedback.all });
    },
  });

  return {
    submitFeedback: submitFeedbackMutation,
    isSubmitting: submitFeedbackMutation.isPending,
  };
}
