"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getMyContentSourcesQueryOptions } from "@/queries/content-sources.query";
import { createContentSource, previewScrape } from "@/app/actions/content-sources";
import { getQueryKey } from "@/lib/query/get-query-keys";
import type { ContentSourceInput } from "@/types/contributor.types";

export function useContributorSources() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");

  const mySources = useQuery(
    getMyContentSourcesQueryOptions({
      page,
      pageSize,
      search: searchQuery || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      language: languageFilter === "all" ? undefined : languageFilter,
    })
  );

  const createSource = useMutation({
    mutationFn: (input: ContentSourceInput) => createContentSource(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.contentSources.mine() });
    },
  });

  const preview = useMutation({
    mutationFn: (input: { url: string }) => previewScrape(input),
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

  const totalPages = mySources.data ? Math.ceil(mySources.data.total / pageSize) : 0;

  return {
    mySources,
    createSource,
    preview,
    isLoading: mySources.isLoading,
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
