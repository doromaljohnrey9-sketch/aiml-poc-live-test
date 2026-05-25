"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ActivityIcon, CheckCircleIcon, AlertTriangleIcon } from "lucide-react";

interface PipelineCountsCardProps {
  awaitingReviewCount?: number;
  approvedCount?: number;
  failedDistributionCount?: number;
}

export function PipelineCountsCard({
  awaitingReviewCount = 0,
  approvedCount = 0,
  failedDistributionCount = 0,
}: PipelineCountsCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Awaiting Review
            </CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {awaitingReviewCount === 0 ? "-" : awaitingReviewCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Ready for your review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved Content
            </CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvedCount === 0 ? "-" : approvedCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Ready for distribution</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed Distributions
            </CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {failedDistributionCount === 0 ? "-" : failedDistributionCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
        </CardContent>
      </Card>
    </div>
  );
}
