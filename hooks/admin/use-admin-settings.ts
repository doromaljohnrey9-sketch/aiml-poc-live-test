"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addAdminBannedPhrase,
  deleteAdminBannedPhrase,
  updateAdminSystemConfig,
} from "@/app/actions/admin";
import {
  getAdminBannedPhrasesQueryOptions,
  getAdminSystemConfigQueryOptions,
} from "@/queries/admin.query";
import { getQueryKey } from "@/lib/query/get-query-keys";

export function useAdminSettings() {
  const queryClient = useQueryClient();
  const systemConfig = useQuery(getAdminSystemConfigQueryOptions());
  const bannedPhrases = useQuery(getAdminBannedPhrasesQueryOptions());

  const updateSystemConfig = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      updateAdminSystemConfig(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.admin.systemConfig() });
      queryClient.invalidateQueries({ queryKey: getQueryKey.admin.dashboardSummary() });
    },
  });

  const addBannedPhrase = useMutation({
    mutationFn: (phrase: string) => addAdminBannedPhrase(phrase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.admin.bannedPhrases() });
    },
  });

  const deleteBannedPhrase = useMutation({
    mutationFn: (id: string) => deleteAdminBannedPhrase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.admin.bannedPhrases() });
    },
  });

  return {
    systemConfig,
    bannedPhrases,
    updateSystemConfig,
    addBannedPhrase,
    deleteBannedPhrase,
    isLoading: systemConfig.isLoading || bannedPhrases.isLoading,
  };
}
