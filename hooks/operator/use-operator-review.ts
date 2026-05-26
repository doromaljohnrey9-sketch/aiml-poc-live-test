"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getAwaitingReviewQueryOptions } from "@/queries/operator.query";
import { submitReview } from "@/app/actions/review";
import { getQueryKey } from "@/lib/query/get-query-keys";
import type { ReviewInput } from "@/types/review.types";

export function useOperatorReview() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");

  const awaiting = useQuery(
    getAwaitingReviewQueryOptions(
      page,
      pageSize,
      searchQuery || undefined,
      statusFilter === "all" ? undefined : statusFilter,
      languageFilter === "all" ? undefined : languageFilter
    )
  );

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

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleLanguageFilterChange = (value: string) => {
    setLanguageFilter(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = awaiting.data ? Math.ceil(awaiting.data.total / pageSize) : 0;

  return {
    awaiting,
    submit,
    isLoading: awaiting.isLoading,
    search: searchInput,
    statusFilter,
    languageFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleStatusFilterChange,
    handleLanguageFilterChange,
    handlePageChange,
  };
}
