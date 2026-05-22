"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApprovedContentQueryOptions } from "@/queries/operator.query";
import { publishContent } from "@/app/actions/distribution";
import { getQueryKey } from "@/lib/query/get-query-keys";

export type PublishInput = Parameters<typeof publishContent>[0];

export function useOperatorDistribution() {
  const queryClient = useQueryClient();

  const approved = useQuery(getApprovedContentQueryOptions());

  const publish = useMutation<Awaited<ReturnType<typeof publishContent>>, Error, PublishInput>({
    mutationFn: (input) => publishContent(input),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.operator.approved() });
      if (variables.generated_content_id) {
        queryClient.invalidateQueries({
          queryKey: getQueryKey.operator.distributionLogs(variables.generated_content_id),
        });
      }
      queryClient.invalidateQueries({ queryKey: getQueryKey.admin.dashboardSummary() });
    },
  });

  return { approved, publish, isLoading: approved.isLoading };
}
