"use client";

import { useQuery } from "@tanstack/react-query";
import { getGeneratedContentDetailQueryOptions } from "@/queries/operator.query";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  XIcon,
  ExternalLinkIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { LogItem } from "../LogsColumns";

interface LogDetailDrawerProps {
  log: LogItem | null;
  onClose: () => void;
}

export function LogDetailDrawer({ log, onClose }: LogDetailDrawerProps) {
  const { data: detail, isLoading } = useQuery({
    ...getGeneratedContentDetailQueryOptions(log?.generatedContentId ?? ""),
    enabled: !!log?.generatedContentId,
  });

  if (!log) return null;

  const getStatusIcon = () => {
    switch (log.status) {
      case "published":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "failed":
        return <AlertTriangleIcon className="h-5 w-5 text-destructive" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getStatusVariant = () => {
    switch (log.status) {
      case "published":
        return "default";
      case "failed":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Drawer open={!!log} onOpenChange={onClose} direction="right">
      <DrawerContent className="h-full">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>Distribution Log Details</DrawerTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
            {/* Status */}
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
              {getStatusIcon()}
              <div className="flex-1">
                <p className="text-sm font-semibold">Status</p>
                <Badge variant={getStatusVariant()} className="mt-1 capitalize">
                  {log.status}
                </Badge>
              </div>
            </div>

            {/* Channel */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">Channel</p>
              <Badge variant="outline" className="capitalize w-fit">
                {log.channel}
              </Badge>
            </div>

            {/* Timestamps */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Created</p>
                <p className="text-sm text-muted-foreground">
                  {log.createdAt
                    ? `${new Date(log.createdAt).toLocaleString()} (${formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })})`
                    : "—"}
                </p>
              </div>

              {log.scheduledAt && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold">Scheduled</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(log.scheduledAt).toLocaleString()} (
                    {formatDistanceToNow(new Date(log.scheduledAt), { addSuffix: true })})
                  </p>
                </div>
              )}

              {log.publishedAt && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold">Published</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(log.publishedAt).toLocaleString()} (
                    {formatDistanceToNow(new Date(log.publishedAt), { addSuffix: true })})
                  </p>
                </div>
              )}
            </div>

            {/* External Post ID */}
            {log.externalPostId && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">External Post ID</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded">{log.externalPostId}</code>
                </div>
              </div>
            )}

            {/* Error Message */}
            {log.errorMessage && (
              <div className="flex flex-col gap-2 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="flex items-center gap-2">
                  <AlertTriangleIcon className="h-4 w-4 text-destructive" />
                  <p className="text-sm font-semibold text-destructive">Error</p>
                </div>
                <p className="text-sm text-destructive">{log.errorMessage}</p>
              </div>
            )}

            {/* Related Content */}
            {log.generatedContentId && (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold">Related Content</p>
                {isLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : detail ? (
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">Content ID: {detail.id}</p>
                      {detail.language && <Badge variant="secondary">{detail.language}</Badge>}
                    </div>
                    <p className="text-sm line-clamp-3">
                      {(() => {
                        if (!detail.channelFormats) return detail.generatedText;
                        const formats = detail.channelFormats as any;
                        const linkedin = formats.linkedin;
                        if (typeof linkedin === "string") return linkedin;
                        if (typeof linkedin === "object" && linkedin !== null) {
                          return linkedin.post || JSON.stringify(linkedin);
                        }
                        return detail.generatedText;
                      })()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Content not found</p>
                )}
              </div>
            )}
          </div>
        </div>

        <DrawerFooter className="border-t px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
