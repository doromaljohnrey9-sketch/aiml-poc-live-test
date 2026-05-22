"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { updateAdminUser } from "@/app/actions/admin";
import { getAdminUsersQueryOptions } from "@/queries/admin.query";
import { getQueryKey } from "@/lib/query/get-query-keys";
import type { AdminUserUpdate } from "@/types/admin.types";

export function useAdminUserManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const users = useQuery(
    getAdminUsersQueryOptions({
      page,
      pageSize,
      search: searchQuery || undefined,
      role: roleFilter === "all" ? undefined : roleFilter,
      isActive: statusFilter === "all" ? undefined : statusFilter === "active" ? true : false,
    })
  );

  const updateUser = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: AdminUserUpdate }) =>
      updateAdminUser(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.admin.users() });
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = users.data ? Math.ceil(users.data.total / pageSize) : 0;

  return {
    users,
    updateUser,
    isLoading: users.isLoading,
    search: searchInput,
    roleFilter,
    statusFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleRoleFilterChange,
    handleStatusFilterChange,
    handlePageChange,
  };
}
