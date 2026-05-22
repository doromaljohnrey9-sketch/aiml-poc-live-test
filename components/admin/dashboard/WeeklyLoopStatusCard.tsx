"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AdminDashboardSummary } from "@/types/admin.types";

interface WeeklyLoopStatusCardProps {
  loopStatus?: AdminDashboardSummary["loopStatus"];
}

export function WeeklyLoopStatusCard({ loopStatus }: WeeklyLoopStatusCardProps) {
  const status = loopStatus || {
    weeklyLoopEnabled: false,
    loopDay: null,
    loopTime: null,
    supportedLanguages: [],
    lastRun: null,
    nextRun: null,
    itemsProcessed: 0,
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Weekly Loop Status</CardTitle>
            <CardDescription>Content generation and distribution schedule</CardDescription>
          </div>
          <Badge variant={status.weeklyLoopEnabled ? "default" : "secondary"}>
            {status.weeklyLoopEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">Loop Schedule</p>
            <p className="text-sm text-muted-foreground">
              {status.loopDay && status.loopTime
                ? `${status.loopDay} at ${status.loopTime} UTC`
                : "Not configured"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Last Run</p>
            <p className="text-sm text-muted-foreground">
              {status.lastRun ? new Date(status.lastRun).toLocaleString() : "Never"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Next Run</p>
            <p className="text-sm text-muted-foreground">
              {status.nextRun ? new Date(status.nextRun).toLocaleString() : "Not scheduled"}
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium">Items Processed (Last Run)</p>
            <p className="text-2xl font-bold">{status.itemsProcessed}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Supported Languages</p>
            <div className="flex flex-wrap gap-1">
              {status.supportedLanguages.length ? (
                status.supportedLanguages.map((lang) => (
                  <Badge key={lang} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">None configured</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
