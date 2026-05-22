"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 p-8">
      <Card className="max-w-2xl mx-auto border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">User Management Error</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Failed to load user management data. This may be due to a permissions issue or a
            temporary server error.
          </p>
          <div className="flex gap-2">
            <Button onClick={reset} variant="outline">
              Try Again
            </Button>
            <Button asChild variant="ghost">
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
