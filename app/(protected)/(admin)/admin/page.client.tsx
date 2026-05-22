"use client";

import { useAdminDashboard } from "@/hooks/admin/use-admin-dashboard";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClockIcon, ActivityIcon, CheckCircleIcon, PieChartIcon, TerminalIcon } from "lucide-react";
import Link from "next/link";

import { WeeklyLoopStatusCard } from "../../../../components/admin/dashboard/WeeklyLoopStatusCard";
import { ChannelActivityCard } from "../../../../components/admin/dashboard/ChannelActivityCard";
import { FailedDistributionsCard } from "../../../../components/admin/dashboard/FailedDistributionsCard";
import { QuickActionsCard } from "../../../../components/admin/dashboard/QuickActionsCard";

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const displayValue = value === 0 ? "-" : value;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayValue}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminPageClient() {
  const { profile, isLoading: authLoading, user } = useAuth();
  const { summary, isLoading: dataLoading } = useAdminDashboard();

  const name = profile?.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {authLoading ? "..." : name}. Here&apos;s your system overview.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/settings">
            <TerminalIcon className="h-4 w-4 mr-2" />
            System Settings
          </Link>
        </Button>
      </div>

      {dataLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Pending Sources"
              value={summary?.data?.pipelineCounts.pending ?? 0}
              description="Awaiting processing"
              icon={ClockIcon}
            />
            <MetricCard
              title="Awaiting Review"
              value={summary?.data?.pipelineCounts.awaitingReview ?? 0}
              description="Ready for operator review"
              icon={ActivityIcon}
            />
            <MetricCard
              title="Approved Content"
              value={summary?.data?.pipelineCounts.approved ?? 0}
              description="Approved for distribution"
              icon={CheckCircleIcon}
            />
            <MetricCard
              title="Distributed"
              value={summary?.data?.pipelineCounts.distributed ?? 0}
              description="Successfully sent"
              icon={PieChartIcon}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <WeeklyLoopStatusCard loopStatus={summary?.data?.loopStatus} />
            <ChannelActivityCard channelActivity={summary?.data?.channelActivity} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FailedDistributionsCard
              failedDistributions={summary?.data?.failedDistributions ?? []}
            />
            <QuickActionsCard />
          </div>
        </>
      )}
    </div>
  );
}
