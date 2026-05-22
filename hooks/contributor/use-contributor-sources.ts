"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyContentSourcesQueryOptions } from "@/queries/content-sources.query";
import { createContentSource, previewScrape } from "@/app/actions/content-sources";
import { getQueryKey } from "@/lib/query/get-query-keys";
import type { ContentSourceInput } from "@/types/contributor.types";

export function useContributorSources() {
  const queryClient = useQueryClient();

  const mySources = useQuery(getMyContentSourcesQueryOptions());

  const createSource = useMutation({
    mutationFn: (input: ContentSourceInput) => createContentSource(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.contentSources.mine() });
    },
  });

  const preview = useMutation({
    mutationFn: (input: { url: string }) => previewScrape(input),
  });

  return { mySources, createSource, preview, isLoading: mySources.isLoading };
}
