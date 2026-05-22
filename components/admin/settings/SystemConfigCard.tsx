"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsIcon } from "lucide-react";
import { formatDate, formatKey, formatConfigValue } from "@/lib/format";
import type { AdminSystemConfigItem } from "@/types/admin.types";

interface SystemConfigCardProps {
  config: AdminSystemConfigItem[];
}

export function SystemConfigCard({ config }: SystemConfigCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          <CardTitle>System Configuration</CardTitle>
        </div>
        <CardDescription>Read-only view of all system configuration values.</CardDescription>
      </CardHeader>
      <CardContent>
        {config.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No configuration values found.
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {config.map((item) => (
              <div key={item.key} className="p-3 rounded-lg border bg-muted/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{formatKey(item.key)}</span>
                  <span className="text-xs text-muted-foreground">
                    Updated: {formatDate(item.updatedAt)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground break-all">
                  {formatConfigValue(item.key, item.value)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
