import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDownIcon,
  GlobeIcon,
  FileTextIcon,
  LinkIcon,
  FileIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  LoaderIcon,
  AlertTriangleIcon,
} from "lucide-react";
import type { ContentSource } from "@/types/contributor.types";

export function createSubmissionsColumns(): ColumnDef<ContentSource>[] {
  return [
    {
      id: "spacer",
      header: () => null,
      cell: () => null,
      size: 48,
    },
    {
      accessorKey: "inputType",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Type
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const inputType = row.getValue("inputType") as string;
        const icons = {
          url: <LinkIcon className="h-4 w-4" />,
          text: <FileTextIcon className="h-4 w-4" />,
          document: <FileIcon className="h-4 w-4" />,
        };
        return (
          <div className="flex items-center gap-2">
            {icons[inputType as keyof typeof icons] || <FileIcon className="h-4 w-4" />}
            <span className="capitalize">{inputType}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "rawInput",
      header: "Content",
      size: 80,
      cell: ({ row }) => {
        const rawInput = row.getValue("rawInput") as string | null;
        const inputType = row.getValue("inputType") as string;

        if (!rawInput) return <div className="text-muted-foreground">—</div>;

        if (inputType === "url") {
          return (
            <div className="max-w-[150px] truncate" title={rawInput}>
              <a
                href={rawInput}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {rawInput}
              </a>
            </div>
          );
        }

        return (
          <div className="max-w-[150px] truncate" title={rawInput}>
            {rawInput}
          </div>
        );
      },
    },
    {
      accessorKey: "language",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Language
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const language = row.getValue("language") as string;
        return (
          <div className="flex items-center gap-2">
            <GlobeIcon className="h-4 w-4" />
            <span className="uppercase">{language}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Status
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusConfig = {
          pending: {
            variant: "secondary" as const,
            icon: <ClockIcon className="h-3 w-3" />,
            label: "Pending",
          },
          processing: {
            variant: "default" as const,
            icon: <LoaderIcon className="h-3 w-3" />,
            label: "Processing",
          },
          processed: {
            variant: "default" as const,
            icon: <CheckCircleIcon className="h-3 w-3" />,
            label: "Processed",
          },
          distributed: {
            variant: "default" as const,
            icon: <CheckCircleIcon className="h-3 w-3" />,
            label: "Distributed",
          },
          failed: {
            variant: "destructive" as const,
            icon: <XCircleIcon className="h-3 w-3" />,
            label: "Failed",
          },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

        return (
          <Badge variant={config.variant} className="gap-1">
            {config.icon}
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "contextNote",
      header: "Note",
      cell: ({ row }) => {
        const contextNote = row.getValue("contextNote") as string | null;
        if (!contextNote) return <div className="text-muted-foreground">—</div>;
        return (
          <div className="max-w-[200px] truncate text-muted-foreground" title={contextNote}>
            {contextNote}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Submitted
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        return (
          <div className="text-muted-foreground">{new Date(createdAt).toLocaleDateString()}</div>
        );
      },
    },
  ];
}
