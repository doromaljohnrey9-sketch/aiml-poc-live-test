"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { ClipboardCheck } from "lucide-react";

export default function OperatorPageClient() {
  const { profile, isLoading, user } = useAuth();

  const name = profile?.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <Empty className="max-w-md">
        <EmptyMedia variant="icon">
          <ClipboardCheck className="h-6 w-6" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Welcome, {isLoading ? "..." : name}!</EmptyTitle>
          <EmptyDescription>
            You are logged in as an <strong>Operator</strong>. This is your control hub for
            reviewing AI-generated content and managing distribution.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
