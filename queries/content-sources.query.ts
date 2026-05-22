import { queryOptions } from "@tanstack/react-query";

import { getMyContentSources, getContentSourceDetail } from "@/app/actions/content-sources";
import { getQueryKey } from "@/lib/query/get-query-keys";

export const getMyContentSourcesQueryOptions = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  language?: string;
}) =>
  queryOptions({
    queryKey: [...getQueryKey.contentSources.mine(), params],
    queryFn: () => getMyContentSources(params),
  });

export const getContentSourceDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: getQueryKey.contentSources.detail(id),
    queryFn: () => getContentSourceDetail(id),
  });
