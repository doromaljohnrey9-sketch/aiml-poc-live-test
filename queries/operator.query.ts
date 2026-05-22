import { queryOptions } from "@tanstack/react-query";

import { getAwaitingReview, getGeneratedContentDetail } from "@/app/actions/review";
import { getApprovedContent, getDistributionLogs } from "@/app/actions/distribution";
import { getQueryKey } from "@/lib/query/get-query-keys";

export const getAwaitingReviewQueryOptions = (page = 1, pageSize = 20) =>
  queryOptions({
    queryKey: getQueryKey.operator.awaitingReview(),
    queryFn: () => getAwaitingReview(page, pageSize),
  });

export const getGeneratedContentDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: getQueryKey.operator.generatedDetail(id),
    queryFn: () => getGeneratedContentDetail(id),
  });

export const getApprovedContentQueryOptions = (page = 1, pageSize = 20) =>
  queryOptions({
    queryKey: getQueryKey.operator.approved(),
    queryFn: () => getApprovedContent(page, pageSize),
  });

export const getDistributionLogsQueryOptions = (generatedContentId?: string) =>
  queryOptions({
    queryKey: getQueryKey.operator.distributionLogs(generatedContentId ?? ""),
    queryFn: () => getDistributionLogs(generatedContentId),
  });

export const getOperatorSummaryQueryOptions = () =>
  queryOptions({
    queryKey: getQueryKey.operator.summary(),
    queryFn: async () => {
      // Lightweight summary: counts for awaiting review, approved, failed distributions
      const awaiting = await getAwaitingReview(1, 1);
      const approved = await getApprovedContent(1, 1);
      // For failed distributions, call getDistributionLogs and filter (could be optimized server-side)
      const logs = await getDistributionLogs();

      return {
        awaitingReviewCount: Array.isArray(awaiting) ? awaiting.length : 0,
        approvedCount: Array.isArray(approved) ? approved.length : 0,
        failedDistributionCount: Array.isArray(logs)
          ? logs.filter((l) => l.status === "failed").length
          : 0,
      };
    },
  });
