import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { XIcon, ClockIcon, FileTextIcon, GlobeIcon, TypeIcon } from "lucide-react";
import { ContentSource } from "@/types/contributor.types";

interface SubmissionDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ContentSource | null;
}

export function SubmissionDetailDrawer({ open, onOpenChange, data }: SubmissionDetailDrawerProps) {
  if (!data) return null;

  const getInputTypeIcon = (type: string) => {
    switch (type) {
      case "url":
        return <GlobeIcon className="h-4 w-4" />;
      case "text":
        return <TypeIcon className="h-4 w-4" />;
      case "document":
        return <FileTextIcon className="h-4 w-4" />;
      default:
        return <FileTextIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "processed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "distributed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <DrawerTitle>Submission Details</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <XIcon className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto">
            <FieldGroup className="p-6">
              <Field orientation="horizontal">
                <FieldLabel>Type</FieldLabel>
                <div className="flex items-center gap-2">
                  {getInputTypeIcon(data.inputType)}
                  <span className="text-sm capitalize">{data.inputType}</span>
                </div>
              </Field>

              <Field orientation="horizontal">
                <FieldLabel>Status</FieldLabel>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(data.status)}`}
                >
                  {data.status}
                </span>
              </Field>

              <Field>
                <FieldLabel htmlFor="raw-input">Raw Input</FieldLabel>
                <FieldDescription>{data.rawInput || "N/A"}</FieldDescription>
              </Field>

              {data.extractedText && (
                <Field>
                  <FieldLabel htmlFor="extracted-text">Extracted Text</FieldLabel>
                  <FieldDescription className="max-h-[200px] overflow-y-auto">
                    {data.extractedText}
                  </FieldDescription>
                </Field>
              )}

              {data.contextNote && (
                <Field>
                  <FieldLabel htmlFor="context-note">Context Note</FieldLabel>
                  <FieldDescription>{data.contextNote}</FieldDescription>
                </Field>
              )}

              <Field orientation="horizontal">
                <FieldLabel>
                  <ClockIcon className="h-3 w-3 mr-1" />
                  Created
                </FieldLabel>
                <span className="text-sm">{formatDate(data.createdAt)}</span>
              </Field>

              <Field orientation="horizontal">
                <FieldLabel>
                  <ClockIcon className="h-3 w-3 mr-1" />
                  Updated
                </FieldLabel>
                <span className="text-sm">{formatDate(data.updatedAt)}</span>
              </Field>

              <Field orientation="horizontal">
                <FieldLabel>Language</FieldLabel>
                <span className="text-sm capitalize">
                  {data.language === "en" ? "English" : "Korean"}
                </span>
              </Field>
            </FieldGroup>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
