import { queryOptions } from "@tanstack/react-query";

import { getCurrentUserProfile } from "@/app/actions/users";
import { getQueryKey } from "@/lib/query/get-query-keys";

export const getUserQueryOptions = () =>
  queryOptions({
    queryKey: getQueryKey.users.me(),
    queryFn: () => getCurrentUserProfile(),
  });
