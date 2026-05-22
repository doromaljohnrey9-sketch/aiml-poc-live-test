"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UsersIcon,
  ShieldCheckIcon,
  TerminalIcon,
  PieChartIcon,
  ArrowRightIcon,
} from "lucide-react";
import Link from "next/link";

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common admin tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/admin/pipeline">
            <PieChartIcon className="h-4 w-4 mr-2" />
            View Pipeline Status
            <ArrowRightIcon className="h-4 w-4 ml-auto" />
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/admin/users">
            <UsersIcon className="h-4 w-4 mr-2" />
            Manage Users
            <ArrowRightIcon className="h-4 w-4 ml-auto" />
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/admin/banned-phrases">
            <ShieldCheckIcon className="h-4 w-4 mr-2" />
            Banned Phrases
            <ArrowRightIcon className="h-4 w-4 ml-auto" />
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/admin/settings">
            <TerminalIcon className="h-4 w-4 mr-2" />
            System Settings
            <ArrowRightIcon className="h-4 w-4 ml-auto" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
