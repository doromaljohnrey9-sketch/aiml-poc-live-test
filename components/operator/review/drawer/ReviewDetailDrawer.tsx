"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGeneratedContentDetailQueryOptions } from "@/queries/operator.query";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircleIcon, XCircleIcon, Loader2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";
import type { ReviewInput } from "@/types/review.types";

interface ReviewDetailDrawerProps {
  contentId: string;
  onClose: () => void;
  onSubmitReview: (input: ReviewInput) => void;
  isSubmitting: boolean;
}

export function ReviewDetailDrawer({
  contentId,
  onClose,
  onSubmitReview,
  isSubmitting,
}: ReviewDetailDrawerProps) {
  const { data: detail, isLoading } = useQuery(getGeneratedContentDetailQueryOptions(contentId));

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(true);
  const [checkboxes, setCheckboxes] = useState({
    factual: false,
    ndaSafe: false,
    tone: false,
  });
  const [rejectionReason, setRejectionReason] = useState("");

  const isFormValid = isApproving
    ? checkboxes.factual && checkboxes.ndaSafe && checkboxes.tone
    : rejectionReason.trim().length > 0;

  const handleToggleCheckbox = (key: keyof typeof checkboxes) => {
    setCheckboxes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = () => {
    if (!isFormValid) {
      toast.error(
        isApproving ? "Please check all items to approve" : "Please provide a rejection reason"
      );
      return;
    }

    const input: ReviewInput = {
      generated_content_id: contentId,
      status: isApproving ? "approved" : "rejected",
      checkbox_factual: isApproving ? checkboxes.factual : undefined,
      checkbox_nda_safe: isApproving ? checkboxes.ndaSafe : undefined,
      checkbox_tone: isApproving ? checkboxes.tone : undefined,
      rejection_reason: !isApproving ? rejectionReason : undefined,
    };

    onSubmitReview(input);
  };

  const handleClose = () => {
    setIsReviewDialogOpen(false);
    setIsApproving(true);
    setCheckboxes({ factual: false, ndaSafe: false, tone: false });
    setRejectionReason("");
    onClose();
  };

  return (
    <Drawer open={!!contentId} onOpenChange={handleClose} direction="right">
      <DrawerContent className="h-full">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>Review Content</DrawerTitle>
                <DrawerDescription>
                  Review and approve or reject generated content
                </DrawerDescription>
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
                          <div className="text-sm whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
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
                          <div className="text-sm whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
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
                          <div className="text-sm whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
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
                      <div className="text-sm whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
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
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={() => setIsReviewDialogOpen(true)} disabled={isLoading}>
              Review
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>

      {/* Review Confirmation Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Content</DialogTitle>
            <DialogDescription>Choose to approve or reject this content</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Tabs
              defaultValue="approve"
              className="w-full"
              onValueChange={(value) => {
                setIsApproving(value === "approve");
                if (value === "reject") {
                  setCheckboxes({ factual: false, ndaSafe: false, tone: false });
                }
              }}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="approve">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Approve
                </TabsTrigger>
                <TabsTrigger value="reject">
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Reject
                </TabsTrigger>
              </TabsList>

              <TabsContent value="approve">
                <div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg border">
                  <p className="text-sm font-semibold text-foreground">Approval Checklist</p>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={checkboxes.factual}
                        onCheckedChange={() => handleToggleCheckbox("factual")}
                      />
                      <span className="text-sm">
                        <strong>Factually Accurate:</strong> Content is factually correct and
                        verifiable
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={checkboxes.ndaSafe}
                        onCheckedChange={() => handleToggleCheckbox("ndaSafe")}
                      />
                      <span className="text-sm">
                        <strong>NDA Safe:</strong> No confidential or proprietary information
                        disclosed
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={checkboxes.tone}
                        onCheckedChange={() => handleToggleCheckbox("tone")}
                      />
                      <span className="text-sm">
                        <strong>Appropriate Tone:</strong> Tone and messaging align with brand
                        standards
                      </span>
                    </label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reject">
                <div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg border">
                  <label htmlFor="rejection-reason" className="text-sm font-semibold">
                    Rejection Reason
                  </label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Explain why this content is being rejected..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="min-h-24 resize-none"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting || isLoading}
              variant={isApproving ? "default" : "destructive"}
            >
              {isSubmitting && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
              {isApproving ? "Confirm Approve" : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Drawer>
  );
}
