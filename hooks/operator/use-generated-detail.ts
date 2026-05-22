"use client";

import { useQuery } from "@tanstack/react-query";
import { getGeneratedContentDetailQueryOptions } from "@/queries/operator.query";

export function useGeneratedDetail(id: string) {
  return useQuery(getGeneratedContentDetailQueryOptions(id));
}
