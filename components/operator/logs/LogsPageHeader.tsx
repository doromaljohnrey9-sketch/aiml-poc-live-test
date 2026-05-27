import { Button } from "@/components/ui/button";
import { ListTodoIcon } from "lucide-react";

interface LogsPageHeaderProps {
  totalLogs: number;
}

export function LogsPageHeader({ totalLogs }: LogsPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
        <p className="text-muted-foreground mt-1">
          View distribution activity and status. {totalLogs} log
          {totalLogs !== 1 ? "s" : ""} recorded.
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium">
        <ListTodoIcon className="h-4 w-4" />
        <span>{totalLogs} Total</span>
      </div>
    </div>
  );
}
