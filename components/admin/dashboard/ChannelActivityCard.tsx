"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ActivityIcon } from "lucide-react";
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
              <ActivityIcon className="h-4 w-4 text-blue-500" />
              <span className="text-sm">LinkedIn</span>
            </div>
            <span className="text-sm font-medium">{activity.linkedin}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ActivityIcon className="h-4 w-4 text-green-500" />
              <span className="text-sm">Blog</span>
            </div>
            <span className="text-sm font-medium">{activity.blog}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ActivityIcon className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Newsletter</span>
            </div>
            <span className="text-sm font-medium">{activity.newsletter}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
