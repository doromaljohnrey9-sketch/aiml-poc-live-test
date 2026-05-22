"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LinkedinIcon, FileTextIcon, MailIcon } from "lucide-react";
import type { AdminDashboardSummary } from "@/types/admin.types";

interface ChannelActivityCardProps {
  channelActivity?: AdminDashboardSummary["channelActivity"];
}

export function ChannelActivityCard({ channelActivity }: ChannelActivityCardProps) {
  const activity = channelActivity || { linkedin: 0, blog: 0, newsletter: 0 };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Channel Activity</CardTitle>
        <CardDescription>Distribution by channel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LinkedinIcon className="h-4 w-4 text-primary" />
              <span className="text-sm">LinkedIn</span>
            </div>
            <span className="text-sm text-muted-foreground">Coming Soon</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4 text-primary" />
              <span className="text-sm">Blog</span>
            </div>
            <span className="text-sm text-muted-foreground">Coming Soon</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-primary" />
              <span className="text-sm">Newsletter</span>
            </div>
            <span className="text-sm font-medium">
              {activity.newsletter === 0 ? "-" : activity.newsletter}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
