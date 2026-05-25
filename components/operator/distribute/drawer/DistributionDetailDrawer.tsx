"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGeneratedContentDetailQueryOptions } from "@/queries/operator.query";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle as DialogTitleComponent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { PublishInput } from "@/hooks/operator/use-operator-distribution";

interface DistributionDetailDrawerProps {
  contentId: string;
  onClose: () => void;
  onPublish: (input: PublishInput) => void;
  isPublishing: boolean;
}

export function DistributionDetailDrawer({
  contentId,
  onClose,
  onPublish,
  isPublishing,
}: DistributionDetailDrawerProps) {
  const { data: detail, isLoading } = useQuery(getGeneratedContentDetailQueryOptions(contentId));

  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [isDistributeDialogOpen, setIsDistributeDialogOpen] = useState(false);

  const handleToggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const handlePublish = () => {
    if (selectedChannels.length === 0) {
      toast.error("Please select at least one channel to publish");
      return;
    }

    const input: PublishInput = {
      generated_content_id: contentId,
      channels: selectedChannels,
      scheduled_at: scheduledDate ? scheduledDate.toISOString() : null,
    };

    onPublish(input);
  };

  const handleClose = () => {
    setIsDistributeDialogOpen(false);
    setSelectedChannels([]);
    setScheduledDate(undefined);
    onClose();
  };

  return (
    <Drawer open={!!contentId} onOpenChange={handleClose} direction="right">
      <DrawerContent className="h-full">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>Distribute Content</DrawerTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
            {isLoading ? (
              <div className="flex flex-col gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : !detail ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Content not found</p>
              </div>
            ) : (
              <>
                {/* Content Preview */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Generated Content</h3>
                    <div className="flex gap-2">
                      {detail.language && <Badge variant="secondary">{detail.language}</Badge>}
                    </div>
                  </div>
                  {detail.channelFormats ? (
                    <Tabs defaultValue="linkedin" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                        <TabsTrigger value="blog">Blog</TabsTrigger>
                        <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
                      </TabsList>
                      <TabsContent value="linkedin" className="mt-4">
                        <div className="p-4 bg-muted/50 rounded-lg border">
                          <div className="text-sm whitespace-pre-wrap wrap-break-word max-h-96 overflow-y-auto">
                            {
                              (
                                detail.channelFormats as {
                                  linkedin: string;
                                  blog: string;
                                  newsletter: string;
                                }
                              ).linkedin
                            }
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="blog" className="mt-4">
                        <div className="p-4 bg-muted/50 rounded-lg border">
                          <div className="text-sm whitespace-pre-wrap wrap-break-word max-h-96 overflow-y-auto">
                            {
                              (
                                detail.channelFormats as {
                                  linkedin: string;
                                  blog: string;
                                  newsletter: string;
                                }
                              ).blog
                            }
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="newsletter" className="mt-4">
                        <div className="p-4 bg-muted/50 rounded-lg border">
                          <div className="text-sm whitespace-pre-wrap wrap-break-word max-h-96 overflow-y-auto">
                            {
                              (
                                detail.channelFormats as {
                                  linkedin: string;
                                  blog: string;
                                  newsletter: string;
                                }
                              ).newsletter
                            }
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="p-4 bg-muted/50 rounded-lg border">
                      <div className="text-sm whitespace-pre-wrap wrap-break-word max-h-96 overflow-y-auto">
                        {detail.generatedText}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <DrawerFooter className="border-t px-6 py-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isPublishing}>
              Cancel
            </Button>
            <Button onClick={() => setIsDistributeDialogOpen(true)} disabled={isLoading}>
              Distribute
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>

      {/* Distribution Confirmation Dialog */}
      <Dialog open={isDistributeDialogOpen} onOpenChange={setIsDistributeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitleComponent>Distribute Content</DialogTitleComponent>
            <DialogDescription>Select channels and schedule for publishing</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            {/* Channel Selection */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">Select Channels</p>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={selectedChannels.includes("linkedin")}
                    onCheckedChange={() => handleToggleChannel("linkedin")}
                  />
                  <span className="text-sm">LinkedIn</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={selectedChannels.includes("blog")}
                    onCheckedChange={() => handleToggleChannel("blog")}
                  />
                  <span className="text-sm">Blog</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={selectedChannels.includes("newsletter")}
                    onCheckedChange={() => handleToggleChannel("newsletter")}
                  />
                  <span className="text-sm">Newsletter</span>
                </label>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Schedule (Optional)
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {scheduledDate ? format(scheduledDate, "PPP HH:mm") : "Pick a date and time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">Leave empty to publish immediately</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDistributeDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing || isLoading || selectedChannels.length === 0}
            >
              {isPublishing && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Drawer>
  );
}
