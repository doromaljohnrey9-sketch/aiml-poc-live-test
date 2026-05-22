"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-full min-h-[calc(100vh-var(--header-height)-1px)] w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold tracking-tighter text-muted-foreground/20">404</h1>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Page not found</h2>
          <p className="mx-auto max-w-[400px] text-muted-foreground text-sm sm:text-base">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved
            or deleted.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="default">Back to Home</Button>
          </Link>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
