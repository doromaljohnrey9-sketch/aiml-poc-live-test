"use client";

import { useQuery } from "@tanstack/react-query";
import { getOperatorSummaryQueryOptions } from "@/queries/operator.query";

export function useOperatorDashboard() {
  const summary = useQuery(getOperatorSummaryQueryOptions());

  return {
    summary,
    isLoading: summary.isLoading,
  };
}
