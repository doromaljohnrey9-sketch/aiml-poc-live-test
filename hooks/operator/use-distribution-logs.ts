"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getDistributionLogsQueryOptions } from "@/queries/operator.query";

export function useDistributionLogs(generatedContentId?: string) {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");

  const data = useQuery(
    getDistributionLogsQueryOptions(
      page,
      pageSize,
      searchQuery || undefined,
      statusFilter === "all" ? undefined : statusFilter,
      channelFilter === "all" ? undefined : channelFilter,
      generatedContentId
    )
  );

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

  const handleChannelFilterChange = (value: string) => {
    setChannelFilter(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = data.data ? Math.ceil(data.data.total / pageSize) : 0;

  return {
    data,
    isLoading: data.isLoading,
    search: searchInput,
    statusFilter,
    channelFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleStatusFilterChange,
    handleChannelFilterChange,
    handlePageChange,
  };
}
