import { queryOptions } from "@tanstack/react-query";

import { getMyContentSources, getContentSourceDetail } from "@/app/actions/content-sources";
import { getQueryKey } from "@/lib/query/get-query-keys";

export const getMyContentSourcesQueryOptions = () =>
  queryOptions({
    queryKey: getQueryKey.contentSources.mine(),
    queryFn: () => getMyContentSources(),
  });

export const getContentSourceDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: getQueryKey.contentSources.detail(id),
    queryFn: () => getContentSourceDetail(id),
  });
