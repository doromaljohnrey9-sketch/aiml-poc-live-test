"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminDashboardSummaryQueryOptions } from "@/queries/admin.query";

export function useAdminDashboard() {
  const summary = useQuery(getAdminDashboardSummaryQueryOptions());

  return { summary, isLoading: summary.isLoading };
}
