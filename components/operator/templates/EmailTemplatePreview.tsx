"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NewsletterData {
  subject?: string;
  preview?: string;
  title?: string;
  body?: string;
  cta?: string;
  callout?: string;
  quote?: string;
}

interface EmailTemplatePreviewProps {
  data: NewsletterData | string;
  className?: string;
}

export function EmailTemplatePreview({ data, className }: EmailTemplatePreviewProps) {
  const newsletter: NewsletterData = typeof data === "string" ? {} : (data as NewsletterData);

  if (typeof data === "string" && !data.trim()) {
    return (
      <div className={cn("p-6 text-center text-muted-foreground", className)}>
        No newsletter content available
      </div>
    );
  }

  if (typeof data === "string") {
    // Fallback for string content
    return (
      <div className={cn("p-6 bg-background rounded-lg border", className)}>
        <div className="text-sm whitespace-pre-wrap wrap-break-word">{data}</div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-2xl mx-auto min-h-0", className)}>
      {/* Email Container */}
      <div className="bg-background rounded-lg border shadow-sm overflow-hidden flex flex-col max-h-full">
        {/* Email Header */}
        <div className="bg-primary px-6 py-8 text-primary-foreground">
          <h1 className="text-2xl font-bold mb-2">{newsletter.title || "Newsletter"}</h1>
          {newsletter.subject && (
            <p className="text-primary-foreground/80 text-sm">Subject: {newsletter.subject}</p>
          )}
        </div>

        {/* Email Body */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Preview Text */}
          {newsletter.preview && (
            <div className="text-sm text-muted-foreground italic border-l-2 border-border pl-4">
              {newsletter.preview}
            </div>
          )}

          {/* Main Body */}
          {newsletter.body && (
            <div className="prose prose-sm max-w-none">
              <div className="text-sm whitespace-pre-wrap wrap-break-word leading-relaxed">
                {newsletter.body}
              </div>
            </div>
          )}

          {/* Callout Box */}
          {newsletter.callout && (
            <div className="bg-muted border border-border rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground mb-1">💡 Key Takeaway</p>
              <p className="text-sm text-muted-foreground">{newsletter.callout}</p>
            </div>
          )}

          {/* Quote */}
          {newsletter.quote && (
            <div className="border-l-4 border-primary pl-4 py-2 bg-muted rounded-r-lg">
              <p className="text-sm italic text-muted-foreground">
                &ldquo;{newsletter.quote}&rdquo;
              </p>
            </div>
          )}

          {/* CTA Button */}
          {newsletter.cta && (
            <div className="pt-4">
              <Button className="w-full sm:w-auto">{newsletter.cta}</Button>
            </div>
          )}
        </div>

        {/* Email Footer */}
        <div className="bg-muted border-t px-6 py-4">
          <p className="text-xs text-muted-foreground text-center">
            You&apos;re receiving this email because you subscribed to our newsletter.
          </p>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-4 p-4 bg-muted/50 rounded-lg border flex flex-col gap-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Email Metadata
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {newsletter.subject && (
            <div>
              <span className="font-medium">Subject:</span> {newsletter.subject}
            </div>
          )}
          {newsletter.preview && (
            <div>
              <span className="font-medium">Preview:</span> {newsletter.preview}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
