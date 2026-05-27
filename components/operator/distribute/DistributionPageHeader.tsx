import { Button } from "@/components/ui/button";
import { ShareIcon } from "lucide-react";

interface DistributionPageHeaderProps {
  totalApproved: number;
}

export function DistributionPageHeader({ totalApproved }: DistributionPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Distribution Hub</h1>
        <p className="text-muted-foreground mt-1">
          Distribute approved content to channels. {totalApproved} item
          {totalApproved !== 1 ? "s" : ""} ready for distribution.
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium">
        <ShareIcon className="h-4 w-4" />
        <span>{totalApproved} Ready</span>
      </div>
    </div>
  );
}
