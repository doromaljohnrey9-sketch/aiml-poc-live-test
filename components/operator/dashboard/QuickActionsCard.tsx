"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EyeIcon, SendIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common operator tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/operator/review">
            <EyeIcon className="h-4 w-4 mr-2" />
            Review Queue
            <ArrowRightIcon className="h-4 w-4 ml-auto" />
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/operator/distribution">
            <SendIcon className="h-4 w-4 mr-2" />
            Distribution Hub
            <ArrowRightIcon className="h-4 w-4 ml-auto" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
