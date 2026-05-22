import { queryOptions } from "@tanstack/react-query";

import {
  getAdminBannedPhrases,
  getAdminDashboardSummary,
  getAdminSystemConfig,
  getAdminUsers,
} from "@/app/actions/admin";
import { getQueryKey } from "@/lib/query/get-query-keys";

export const getAdminDashboardSummaryQueryOptions = () =>
  queryOptions({
    queryKey: getQueryKey.admin.dashboardSummary(),
    queryFn: () => getAdminDashboardSummary(),
  });

export const getAdminBannedPhrasesQueryOptions = () =>
  queryOptions({
    queryKey: getQueryKey.admin.bannedPhrases(),
    queryFn: () => getAdminBannedPhrases(),
  });

export const getAdminSystemConfigQueryOptions = () =>
  queryOptions({
    queryKey: getQueryKey.admin.systemConfig(),
    queryFn: () => getAdminSystemConfig(),
  });

export const getAdminUsersQueryOptions = () =>
  queryOptions({
    queryKey: getQueryKey.admin.users(),
    queryFn: () => getAdminUsers(),
  });
