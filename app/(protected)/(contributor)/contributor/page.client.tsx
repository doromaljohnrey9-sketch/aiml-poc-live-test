"use client";

import { useAuth } from "@/hooks/use-auth";
import { 
  Empty, 
  EmptyHeader, 
  EmptyTitle, 
  EmptyDescription, 
  EmptyMedia 
} from "@/components/ui/empty";
import { User } from "lucide-react";

export default function ContributorPageClient() {
  const { profile, isLoading, user } = useAuth();
  
  const name = profile?.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <Empty className="max-w-md">
        <EmptyMedia variant="icon">
          <User className="h-6 w-6" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Welcome, {isLoading ? "..." : name}!</EmptyTitle>
          <EmptyDescription>
            You are logged in as a <strong>Contributor</strong>. This is your workspace placeholder.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
