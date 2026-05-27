"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquareIcon } from "lucide-react";
import { toast } from "sonner";
import { feedbackSchema, type FeedbackFormValues } from "@/schemas/feedback.schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFeedback } from "@/hooks/use-feedback";

export const FeedbackDialog = () => {
  const [open, setOpen] = React.useState(false);
  const { submitFeedback, isSubmitting } = useFeedback();
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      message: "",
    },
  });

  const onSubmit = async (values: FeedbackFormValues) => {
    const result = await submitFeedback.mutateAsync(values);

    if (result.success) {
      toast.success("Thank you for your feedback!", {
        description: "We appreciate your input.",
      });
      setOpen(false);
      form.reset();
    } else {
      toast.error("Failed to submit feedback", {
        description: result.error || "Please try again later.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Send feedback">
          <MessageSquareIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve by sharing your thoughts and experience.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <RadioGroup
              value={form.watch("rating").toString()}
              onValueChange={(value) => form.setValue("rating", parseInt(value))}
              className="flex gap-4"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                    {rating}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {form.formState.errors.rating && (
              <p className="text-sm text-destructive">{form.formState.errors.rating.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your feedback</Label>
            <Textarea
              id="message"
              placeholder="Tell us what you think..."
              {...form.register("message")}
              rows={4}
            />
            {form.formState.errors.message && (
              <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
