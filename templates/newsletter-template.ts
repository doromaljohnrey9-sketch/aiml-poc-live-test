export interface NewsletterData {
  subject?: string;
  preview?: string;
  title?: string;
  body?: string;
  cta?: string;
  callout?: string;
  quote?: string;
}

export function generateNewsletterHtml(newsletter: NewsletterData, subject: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">
    <!-- Email Header -->
    <div style="background-color: #2563eb; padding: 32px 24px; color: white;">
      <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: bold;">${newsletter.title || "Newsletter"}</h1>
      ${newsletter.subject ? `<p style="margin: 0; font-size: 14px; opacity: 0.8;">Subject: ${newsletter.subject}</p>` : ""}
    </div>

    <!-- Email Body -->
    <div style="padding: 24px;">
      <!-- Preview Text -->
      ${newsletter.preview ? `
      <div style="font-size: 14px; color: #666; font-style: italic; border-left: 2px solid #e5e5e5; padding-left: 16px; margin-bottom: 24px;">
        ${newsletter.preview}
      </div>` : ""}

      <!-- Main Body -->
      ${newsletter.body ? `
      <div style="margin-bottom: 24px;">
        <div style="font-size: 14px; white-space: pre-wrap; line-height: 1.7; color: #333;">
          ${newsletter.body}
        </div>
      </div>` : ""}

      <!-- Callout Box -->
      ${newsletter.callout ? `
      <div style="background-color: #f5f5f5; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #333;">💡 Key Takeaway</p>
        <p style="margin: 0; font-size: 14px; color: #666;">${newsletter.callout}</p>
      </div>` : ""}

      <!-- Quote -->
      ${newsletter.quote ? `
      <div style="border-left: 4px solid #2563eb; padding: 12px 16px; background-color: #f5f5f5; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 14px; font-style: italic; color: #666;">
          "${newsletter.quote}"
        </p>
      </div>` : ""}

      <!-- CTA Button -->
      ${newsletter.cta ? `
      <div style="padding-top: 16px; text-align: center;">
        <a href="#" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">${newsletter.cta}</a>
      </div>` : ""}
    </div>

    <!-- Email Footer -->
    <div style="background-color: #f5f5f5; border-top: 1px solid #e5e5e5; padding: 16px 24px;">
      <p style="margin: 0; font-size: 12px; color: #666; text-align: center;">
        You're receiving this email because you subscribed to our newsletter.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
