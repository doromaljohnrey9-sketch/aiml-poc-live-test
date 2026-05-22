"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAwaitingReviewQueryOptions } from "@/queries/operator.query";
import { submitReview } from "@/app/actions/review";
import { getQueryKey } from "@/lib/query/get-query-keys";
import type { ReviewInput } from "@/types/review.types";

export function useOperatorReview() {
  const queryClient = useQueryClient();

  const awaiting = useQuery(getAwaitingReviewQueryOptions());

  const submit = useMutation<Awaited<ReturnType<typeof submitReview>>, Error, ReviewInput>({
    mutationFn: (input) => submitReview(input),
    onSuccess: (data, variables) => {
      // Invalidate lists and detail for the reviewed item
      queryClient.invalidateQueries({ queryKey: getQueryKey.operator.awaitingReview() });
      if (variables.generated_content_id) {
        queryClient.invalidateQueries({
          queryKey: getQueryKey.operator.generatedDetail(variables.generated_content_id),
        });
      }
      // Also refresh admin dashboard summary
      queryClient.invalidateQueries({ queryKey: getQueryKey.admin.dashboardSummary() });
    },
  });

  return { awaiting, submit, isLoading: awaiting.isLoading };
}
