"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { updateAdminUser } from "@/app/actions/admin";
import { getAdminUsersQueryOptions } from "@/queries/admin.query";
import { getQueryKey } from "@/lib/query/get-query-keys";
import type { AdminUserUpdate } from "@/types/admin.types";

export function useAdminUserManagement() {
  const queryClient = useQueryClient();
  const users = useQuery(getAdminUsersQueryOptions());

  const updateUser = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: AdminUserUpdate }) =>
      updateAdminUser(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.admin.users() });
    },
  });

  return { users, updateUser, isLoading: users.isLoading };
}
