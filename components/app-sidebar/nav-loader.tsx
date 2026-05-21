"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const NavLoader = () => {
  return (
    <div className="space-y-6 px-4 py-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  );
};
