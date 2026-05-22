"use client";

import { useQuery } from "@tanstack/react-query";
import { getDistributionLogsQueryOptions } from "@/queries/operator.query";

export function useDistributionLogs(generatedContentId?: string) {
  return useQuery(getDistributionLogsQueryOptions(generatedContentId));
}
