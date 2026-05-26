"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getApprovedContentQueryOptions } from "@/queries/operator.query";
import { publishContent } from "@/app/actions/distribution";
import { getQueryKey } from "@/lib/query/get-query-keys";

export type PublishInput = Parameters<typeof publishContent>[0];

export function useOperatorDistribution() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string>("all");

  const approved = useQuery(
    getApprovedContentQueryOptions(
      page,
      pageSize,
      searchQuery || undefined,
      languageFilter === "all" ? undefined : languageFilter
    )
  );

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

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleLanguageFilterChange = (value: string) => {
    setLanguageFilter(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = approved.data ? Math.ceil(approved.data.total / pageSize) : 0;

  return {
    approved,
    publish,
    isLoading: approved.isLoading,
    search: searchInput,
    languageFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleLanguageFilterChange,
    handlePageChange,
  };
}
