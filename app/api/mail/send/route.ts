import { sendEmail } from "@/services/mail.service";

import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";
import { requireAuth } from "@/lib/guards/auth.guard";

import { HttpStatus } from "@/constants/http-status.constant";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const rateLimited = await rateLimit("email");
    if (rateLimited) return rateLimited;

    const { error } = await requireAuth();
    if (error) return error;

    const body = await req.json();
    const result = await sendEmail(body);

    if (!result.success) {
      return apiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: result.error || "Failed to send email",
      });
    }

    return apiResponse({
      data: result.data,
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error sending email:", error);

    return apiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to send email",
    });
  }
}
