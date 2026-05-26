import { queryOptions } from "@tanstack/react-query";

import { getAwaitingReview, getGeneratedContentDetail } from "@/app/actions/review";
import { getApprovedContent, getDistributionLogs } from "@/app/actions/distribution";
import { getQueryKey } from "@/lib/query/get-query-keys";

export const getAwaitingReviewQueryOptions = (
  page = 1,
  pageSize = 20,
  search?: string,
  status?: string,
  language?: string
) =>
  queryOptions({
    queryKey: [
      ...getQueryKey.operator.awaitingReview(),
      { page, pageSize, search, status, language },
    ],
    queryFn: () => getAwaitingReview(page, pageSize, search, status, language),
  });

export const getGeneratedContentDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: getQueryKey.operator.generatedDetail(id),
    queryFn: () => getGeneratedContentDetail(id),
  });

export const getApprovedContentQueryOptions = (
  page = 1,
  pageSize = 20,
  search?: string,
  language?: string
) =>
  queryOptions({
    queryKey: [...getQueryKey.operator.approved(), { page, pageSize, search, language }],
    queryFn: () => getApprovedContent(page, pageSize, search, language),
  });

export const getDistributionLogsQueryOptions = (
  page = 1,
  pageSize = 20,
  search?: string,
  status?: string,
  channel?: string,
  generatedContentId?: string
) =>
  queryOptions({
    queryKey: [
      ...getQueryKey.operator.distributionLogs(generatedContentId ?? ""),
      { page, pageSize, search, status, channel },
    ],
    queryFn: () => getDistributionLogs(page, pageSize, search, status, channel, generatedContentId),
  });

export const getOperatorSummaryQueryOptions = () =>
  queryOptions({
    queryKey: getQueryKey.operator.summary(),
    queryFn: async () => {
      // Lightweight summary: counts for awaiting review, approved, failed distributions
      const awaiting = await getAwaitingReview(1, 1);
      const approved = await getApprovedContent(1, 1);
      // For failed distributions, call getDistributionLogs and filter (could be optimized server-side)
      const logs = await getDistributionLogs(1, 1, undefined, "failed", undefined);

      const awaitingTotal = awaiting?.total ?? 0;
      const approvedTotal = approved?.total ?? 0;
      const logsTotal = logs?.total ?? 0;

      return {
        awaitingReviewCount: isNaN(Number(awaitingTotal)) ? 0 : Number(awaitingTotal),
        approvedCount: isNaN(Number(approvedTotal)) ? 0 : Number(approvedTotal),
        failedDistributionCount: isNaN(Number(logsTotal)) ? 0 : Number(logsTotal),
      };
    },
  });
