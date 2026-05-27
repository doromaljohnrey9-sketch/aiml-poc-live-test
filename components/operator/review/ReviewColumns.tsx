import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon, CircleIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface ReviewQueueItem {
  id: string;
  contentSourceId: string | null;
  language: string;
  generationAttempt: number;
  createdAt: string | null;
  channelFormats: { linkedin: string; blog: string; newsletter: string } | null;
  submittedBy: string | null;
  submittedByName: string | null;
}

export function createReviewColumns(): ColumnDef<ReviewQueueItem>[] {
  return [
    {
      id: "spacer",
      header: () => null,
      cell: () => null,
      size: 48,
    },
    {
      id: "status",
      header: () => null,
      cell: () => (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="size-2 rounded-full p-0" />
        </div>
      ),
      size: 32,
    },
    {
      accessorKey: "language",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Language
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const language = row.getValue("language") as string;
        return (
          <Badge variant="secondary">{language.charAt(0).toUpperCase() + language.slice(1)}</Badge>
        );
      },
      size: 120,
    },
    {
      accessorKey: "generationAttempt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Attempt
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const attempt = row.getValue("generationAttempt") as number;
        return (
          <span className="text-sm">
            Attempt <strong>#{attempt}</strong>
          </span>
        );
      },
      size: 100,
    },
    {
      accessorKey: "channelFormats",
      header: () => <div className="text-sm font-medium">Channels</div>,
      cell: ({ row }) => {
        const formats = row.getValue("channelFormats") as {
          linkedin: string;
          blog: string;
          newsletter: string;
        } | null;
        if (!formats) return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {Object.keys(formats).map((format) => (
              <Badge key={format} variant="outline" className="text-xs">
                {format}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "submittedByName",
      header: "Submitted By",
      cell: ({ row }) => {
        const name = row.getValue("submittedByName") as string | null;
        return <span className="text-sm">{name || "Unknown"}</span>;
      },
      size: 120,
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
