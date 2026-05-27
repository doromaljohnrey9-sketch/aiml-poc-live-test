"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGeneratedContentDetailQueryOptions } from "@/queries/operator.query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { CheckCircle, XCircle, Loader2, X, Check, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ReviewInput } from "@/types/review.types";
import { REJECTION_REASONS } from "@/constants/rejection-reasons.constant";
import { EmailTemplatePreview } from "@/components/operator/preview/EmailTemplatePreview";

interface ChannelFormats {
  linkedin?: string;
  blog?: string;
  newsletter?:
    | string
    | {
        subject?: string;
        preview?: string;
        title?: string;
        body?: string;
        cta?: string;
        callout?: string;
        quote?: string;
      };
}

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
  const [rejectionReason, setRejectionReason] = useState<
    "" | (typeof REJECTION_REASONS)[number]["value"]
  >("");
  const [customReason, setCustomReason] = useState("");

  const isFormValid = isApproving
    ? checkboxes.factual && checkboxes.ndaSafe && checkboxes.tone
    : rejectionReason !== "" && (rejectionReason !== "other" || customReason.trim().length > 0);

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
      rejection_reason:
        !isApproving && rejectionReason
          ? rejectionReason === "other"
            ? customReason
            : rejectionReason
          : undefined,
    };

    onSubmitReview(input);
  };

  const handleClose = () => {
    setIsReviewDialogOpen(false);
    setIsApproving(true);
    setCheckboxes({ factual: false, ndaSafe: false, tone: false });
    setRejectionReason("");
    setCustomReason("");
    onClose();
  };

  return (
    <Drawer open={!!contentId} onOpenChange={handleClose} direction="right">
      <DrawerContent className="max-h-screen flex flex-col">
        <DrawerHeader className="border-b px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle>Review Content</DrawerTitle>
              <DrawerDescription>Review and approve or reject generated content</DrawerDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}>
              <X className="size-4" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="flex-1 px-6 py-6 flex flex-col gap-6 min-h-0 overflow-hidden">
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
              <div className="flex flex-col gap-3 min-h-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Generated Content</h3>
                  <div className="flex gap-2">
                    {detail.language && <Badge variant="secondary">{detail.language}</Badge>}
                  </div>
                </div>
                {detail.channelFormats ? (
                  <Tabs defaultValue="newsletter" className="w-full flex flex-col min-h-0">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="linkedin" disabled={true}>
                        LinkedIn (V2)
                      </TabsTrigger>
                      <TabsTrigger value="blog" disabled={true}>
                        Blog (V2)
                      </TabsTrigger>
                      <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
                    </TabsList>
                    <TabsContent value="linkedin" className="mt-4 min-h-0">
                      <div className="p-4 bg-muted/50 rounded-lg border">
                        <div className="text-sm whitespace-pre-wrap wrap-break-word max-h-96 overflow-y-auto">
                          {(detail.channelFormats as ChannelFormats)?.linkedin ||
                            "No LinkedIn content"}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="blog" className="mt-4 min-h-0">
                      <div className="p-4 bg-muted/50 rounded-lg border">
                        <div className="text-sm whitespace-pre-wrap wrap-break-word max-h-96 overflow-y-auto">
                          {(detail.channelFormats as ChannelFormats)?.blog || "No blog content"}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="newsletter" className="mt-4 min-h-0 overflow-y-auto">
                      <EmailTemplatePreview
                        data={(detail.channelFormats as ChannelFormats)?.newsletter || ""}
                      />
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

        <DrawerFooter className="border-t px-6 py-4 shrink-0">
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
                  <CheckCircle className="size-4 mr-2" />
                  Approve
                </TabsTrigger>
                <TabsTrigger value="reject">
                  <XCircle className="size-4 mr-2" />
                  Reject
                </TabsTrigger>
              </TabsList>

              <TabsContent value="approve">
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-semibold text-foreground">Approval Checklist</p>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                      <Checkbox
                        checked={checkboxes.factual}
                        onCheckedChange={() => handleToggleCheckbox("factual")}
                        className="mt-0.5"
                      />
                      <Check className="size-4 text-foreground mt-0.5 shrink-0" />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Factually Accurate</span>
                        <span className="text-xs text-muted-foreground">
                          Content is factually correct and verifiable
                        </span>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                      <Checkbox
                        checked={checkboxes.ndaSafe}
                        onCheckedChange={() => handleToggleCheckbox("ndaSafe")}
                        className="mt-0.5"
                      />
                      <ShieldCheck className="size-4 text-foreground mt-0.5 shrink-0" />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">NDA Safe</span>
                        <span className="text-xs text-muted-foreground">
                          No confidential or proprietary information disclosed
                        </span>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                      <Checkbox
                        checked={checkboxes.tone}
                        onCheckedChange={() => handleToggleCheckbox("tone")}
                        className="mt-0.5"
                      />
                      <Sparkles className="size-4 text-foreground mt-0.5 shrink-0" />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Appropriate Tone</span>
                        <span className="text-xs text-muted-foreground">
                          Tone and messaging align with brand standards
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reject">
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="rejection-reason" className="text-sm font-semibold mb-2 block">
                      Rejection Reason
                    </label>
                    <Select
                      value={rejectionReason}
                      onValueChange={(value) => {
                        setRejectionReason(
                          value as "" | (typeof REJECTION_REASONS)[number]["value"]
                        );
                        if (value !== "other") {
                          setCustomReason("");
                        }
                      }}
                    >
                      <SelectTrigger id="rejection-reason" className="w-full">
                        <SelectValue placeholder="Choose a reason...">
                          {rejectionReason ? (
                            <div className="flex items-center gap-2">
                              {(() => {
                                const Icon = REJECTION_REASONS.find(
                                  (r) => r.value === rejectionReason
                                )?.icon;
                                return Icon ? <Icon className="size-4 text-destructive" /> : null;
                              })()}
                              <span className="font-medium text-sm">
                                {REJECTION_REASONS.find((r) => r.value === rejectionReason)?.label}
                              </span>
                            </div>
                          ) : null}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {REJECTION_REASONS.map((reason) => {
                          const Icon = reason.icon;
                          return (
                            <SelectItem
                              key={reason.value}
                              value={reason.value}
                              className="focus:bg-accent cursor-pointer"
                            >
                              <div className="flex items-start gap-3 py-1">
                                <div className="mt-0.5 shrink-0">
                                  <Icon className="size-4 text-destructive" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-medium text-sm">{reason.label}</span>
                                  <span className="text-xs text-muted-foreground leading-tight">
                                    {reason.description}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  {rejectionReason === "other" && (
                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <label htmlFor="custom-reason" className="text-sm font-medium">
                        Please specify the reason
                      </label>
                      <Textarea
                        id="custom-reason"
                        placeholder="Enter the specific reason for rejection..."
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className="min-h-24 resize-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}
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
              {isSubmitting && <Loader2 className="size-4 mr-2 animate-spin" />}
              {isApproving ? "Confirm Approve" : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Drawer>
  );
}
