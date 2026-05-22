"use client";

import { useQuery } from "@tanstack/react-query";

import { getContentSourceDetailQueryOptions } from "@/queries/content-sources.query";

export function useContentSourceDetail(id: string) {
  const detail = useQuery(getContentSourceDetailQueryOptions(id));

  // Place mutations that affect a single content source here (update, delete, retry, etc.)

  return { detail, isLoading: detail.isLoading };
}
