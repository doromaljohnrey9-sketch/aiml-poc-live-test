import { Resend } from "resend";
import { z } from "zod";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_EMAIL_FROM = process.env.RESEND_EMAIL_FROM;

if (!RESEND_API_KEY || !RESEND_EMAIL_FROM) {
  console.warn("RESEND_API_KEY or RESEND_EMAIL_FROM not set. Email sending will be disabled.");
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export const emailSchema = z.object({
  to: z.email(),
  subject: z.string().min(1),
  html: z.string().min(1),
});

export type EmailInput = z.infer<typeof emailSchema>;

export interface SendEmailResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function sendEmail(input: EmailInput): Promise<SendEmailResult> {
  if (!resend || !RESEND_EMAIL_FROM) {
    return {
      success: false,
      error: "Email service not configured",
    };
  }

  try {
    const validation = emailSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        error: "Invalid email input",
      };
    }

    const { to, subject, html } = validation.data;

    const result = await resend.emails.send({
      from: RESEND_EMAIL_FROM,
      to,
      subject,
      html,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
