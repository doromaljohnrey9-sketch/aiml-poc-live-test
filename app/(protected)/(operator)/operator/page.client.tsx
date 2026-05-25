"use client";

import { useAuth } from "@/hooks/use-auth";
import { useOperatorDashboard } from "@/hooks/operator/use-operator-dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardCheckIcon } from "lucide-react";
import Link from "next/link";

import { PipelineCountsCard } from "@/components/operator/dashboard/PipelineCountsCard";
import { QuickActionsCard } from "@/components/operator/dashboard/QuickActionsCard";

export default function OperatorPageClient() {
  const { profile, isLoading: authLoading, user } = useAuth();
  const { summary, isLoading: dataLoading } = useOperatorDashboard();

  const name = profile?.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operator Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {authLoading ? "..." : name}. Here&apos;s your content review and
            distribution overview.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/operator/review">
            <ClipboardCheckIcon className="h-4 w-4 mr-2" />
            Review Queue
          </Link>
        </Button>
      </div>

      {dataLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
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
          <PipelineCountsCard
            awaitingReviewCount={summary?.data?.awaitingReviewCount}
            approvedCount={summary?.data?.approvedCount}
            failedDistributionCount={summary?.data?.failedDistributionCount}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Review Queue:</strong> Review AI-generated content for factual accuracy,
                  NDA compliance, and tone.
                </p>
                <p>
                  <strong>Distribution Hub:</strong> Publish approved content to LinkedIn, Company
                  Blog, and Newsletter.
                </p>
                <p>
                  The weekly content generation loop runs automatically. Your role is to review and
                  distribute content.
                </p>
              </CardContent>
            </Card>
            <QuickActionsCard />
          </div>
        </>
      )}
    </div>
  );
}
