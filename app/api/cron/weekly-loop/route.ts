import { start } from "workflow/api";
import { aimlWeeklyLoop } from "@/workflows/weekly-loop/workflow";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Verify Vercel Cron authorization header
  const authHeader = request.headers.get("authorization");

  // In production, verify the cron secret from environment variables
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Trigger the weekly loop workflow asynchronously
    await start(aimlWeeklyLoop, []);

    return NextResponse.json({
      message: "Weekly loop workflow started",
    });
  } catch (error) {
    console.error("Failed to start weekly loop workflow:", error);
    return NextResponse.json({ error: "Failed to start workflow" }, { status: 500 });
  }
}
