"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { LoaderIcon, GlobeIcon, LinkIcon, FileTextIcon } from "lucide-react";
import { submitContentSchema, type SubmitContentFormValues } from "@/schemas/contributor.schema";
import type { ContentSourceInput } from "@/types/contributor.types";

interface SubmitContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: ContentSourceInput) => void;
  isSubmitting?: boolean;
}

export function SubmitContentDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: SubmitContentDialogProps) {
  const form = useForm<SubmitContentFormValues>({
    resolver: zodResolver(submitContentSchema),
    defaultValues: {
      language: "en",
      inputType: "url",
      rawInput: "",
      contextNote: "",
    },
  });

  const handleSubmit = (values: SubmitContentFormValues) => {
    onSubmit({
      inputType: values.inputType,
      rawInput: values.rawInput,
      contextNote: values.contextNote || undefined,
      language: values.language,
    });

    form.reset();
    onOpenChange(false);
  };

  const inputType = form.watch("inputType");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Submit New Content</DialogTitle>
          <DialogDescription>
            Provide a URL or text content to be processed by the AI system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup className="py-4">
            {/* Language Selector */}
            <Controller
              name="language"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="language">Target Language</FieldLabel>
                  <div className="w-[200px]">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="language" aria-invalid={fieldState.invalid}>
                        <GlobeIcon className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ko">Korean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />

            {/* Input Type Selector */}
            <Controller
              name="inputType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Input Type</FieldLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="url" id="url" />
                      <FieldLabel
                        htmlFor="url"
                        className="flex items-center gap-2 cursor-pointer font-normal"
                      >
                        <LinkIcon className="h-4 w-4" />
                        URL
                      </FieldLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="text" id="text" />
                      <FieldLabel
                        htmlFor="text"
                        className="flex items-center gap-2 cursor-pointer font-normal"
                      >
                        <FileTextIcon className="h-4 w-4" />
                        Text
                      </FieldLabel>
                    </div>
                  </RadioGroup>
                  {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />

            {/* URL or Text Input */}
            <Controller
              name="rawInput"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="content">
                    {inputType === "url" ? "URL" : "Content"}
                  </FieldLabel>
                  {inputType === "url" ? (
                    <Input
                      {...field}
                      id="content"
                      placeholder="https://example.com/article"
                      disabled={isSubmitting}
                      aria-invalid={fieldState.invalid}
                    />
                  ) : (
                    <Textarea
                      {...field}
                      id="content"
                      placeholder="Paste your content here..."
                      disabled={isSubmitting}
                      rows={6}
                      aria-invalid={fieldState.invalid}
                    />
                  )}
                  {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />

            {/* Context Note (Optional) */}
            <Controller
              name="contextNote"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="context-note">Context Note (Optional)</FieldLabel>
                  <Textarea
                    {...field}
                    id="context-note"
                    placeholder="Add any additional context or instructions..."
                    disabled={isSubmitting}
                    rows={3}
                  />
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Content"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
