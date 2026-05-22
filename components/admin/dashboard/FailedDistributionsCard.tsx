"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import type { AdminDashboardSummary } from "@/types/admin.types";

interface FailedDistributionsCardProps {
  failedDistributions: AdminDashboardSummary["failedDistributions"];
}

function FailedDistributionItem({
  channel,
  errorMessage,
  failedAt,
}: {
  channel: string;
  errorMessage: string | null;
  failedAt: string | null;
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b last:border-0">
      <AlertCircleIcon className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium capitalize">{channel}</span>
          <Badge variant="destructive" className="text-xs">
            Failed
          </Badge>
        </div>
        {errorMessage && (
          <p className="text-xs text-muted-foreground mt-1 truncate">{errorMessage}</p>
        )}
        {failedAt && (
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(failedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

export function FailedDistributionsCard({ failedDistributions }: FailedDistributionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Failed Distributions</CardTitle>
        <CardDescription>Last 10 failed distribution attempts</CardDescription>
      </CardHeader>
      <CardContent>
        {failedDistributions.length ? (
          <div className="space-y-1">
            {failedDistributions.map((failed) => (
              <FailedDistributionItem
                key={failed.id}
                channel={failed.channel}
                errorMessage={failed.errorMessage}
                failedAt={failed.failedAt}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-sm text-muted-foreground">No failed distributions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
