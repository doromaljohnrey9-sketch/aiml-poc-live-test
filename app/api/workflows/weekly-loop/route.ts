import { start } from "workflow/api";
import { aimlWeeklyLoop } from "@/workflows/weekly-loop/workflow";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Optional authentication - if WORKFLOW_SECRET is set, require it
  const authHeader = request.headers.get("authorization");
  const workflowSecret = process.env.WORKFLOW_SECRET;

  if (workflowSecret && authHeader !== `Bearer ${workflowSecret}`) {
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
