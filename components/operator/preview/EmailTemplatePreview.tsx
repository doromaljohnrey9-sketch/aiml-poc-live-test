"use client";

import { cn } from "@/lib/utils";
import { generateNewsletterHtml, type NewsletterData } from "@/templates/newsletter-template";

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

  const subject = newsletter.subject || "Latest Updates from AIML";
  const htmlContent = generateNewsletterHtml(newsletter, subject);

  return (
    <div className={cn("w-full max-w-2xl mx-auto min-h-0", className)}>
      {/* Email Preview - renders the exact HTML that will be sent */}
      <div
        className="bg-background rounded-lg border shadow-sm overflow-hidden"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

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
