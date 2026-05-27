import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface LogItem {
  id: string;
  generatedContentId: string | null;
  channel: string;
  status: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  externalPostId: string | null;
  errorMessage: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export function createLogsColumns(): ColumnDef<LogItem>[] {
  return [
    {
      id: "spacer",
      header: () => null,
      cell: () => null,
      size: 48,
    },
    {
      accessorKey: "channel",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Channel
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const channel = row.getValue("channel") as string;
        return (
          <Badge variant="outline" className="capitalize">
            {channel}
          </Badge>
        );
      },
      size: 120,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Status
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant =
          status === "published"
            ? "default"
            : status === "failed"
              ? "destructive"
              : status === "pending"
                ? "secondary"
                : "outline";
        return <Badge variant={variant}>{status}</Badge>;
      },
      size: 100,
    },
    {
      accessorKey: "scheduledAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Scheduled
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const scheduledAt = row.getValue("scheduledAt") as string | null;
        if (!scheduledAt) return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(scheduledAt), { addSuffix: true })}
          </span>
        );
      },
      size: 140,
    },
    {
      accessorKey: "publishedAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Published
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const publishedAt = row.getValue("publishedAt") as string | null;
        if (!publishedAt) return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}
          </span>
        );
      },
      size: 140,
    },
    {
      accessorKey: "errorMessage",
      header: "Error Message",
      cell: ({ row }) => {
        const errorMessage = row.getValue("errorMessage") as string | null;
        if (!errorMessage) return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <span className="text-sm text-destructive max-w-xs truncate" title={errorMessage}>
            {errorMessage}
          </span>
        );
      },
      size: 200,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Created
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string | null;
        if (!createdAt) return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        );
      },
      size: 140,
    },
  ];
}
