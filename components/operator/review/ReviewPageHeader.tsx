import { Button } from "@/components/ui/button";
import { ClipboardCheckIcon } from "lucide-react";

interface ReviewPageHeaderProps {
  totalAwaitingReview: number;
}

export function ReviewPageHeader({ totalAwaitingReview }: ReviewPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve AI-generated content. {totalAwaitingReview} item
          {totalAwaitingReview !== 1 ? "s" : ""} awaiting review.
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium">
        <ClipboardCheckIcon className="h-4 w-4" />
        <span>{totalAwaitingReview} Pending</span>
      </div>
    </div>
  );
}
