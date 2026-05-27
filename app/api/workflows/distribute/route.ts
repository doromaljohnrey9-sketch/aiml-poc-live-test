import { start } from "workflow/api";
import { aimlDistribute } from "@/workflows/distribute/workflow";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Optional authentication - if WORKFLOW_SECRET is set, require it
  const authHeader = request.headers.get("authorization");
  const workflowSecret = process.env.WORKFLOW_SECRET;

  if (workflowSecret && authHeader !== `Bearer ${workflowSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { generatedContentId, channels, scheduledAt } = body;

    if (!generatedContentId || !channels || !Array.isArray(channels)) {
      return NextResponse.json(
        { error: "Missing required fields: generatedContentId and channels" },
        { status: 400 }
      );
    }

    // Trigger the distribute workflow asynchronously
    await start(aimlDistribute, [generatedContentId, channels, scheduledAt]);

    return NextResponse.json({
      message: "Distribute workflow started",
      generatedContentId,
      channels,
      scheduledAt,
    });
  } catch (error) {
    console.error("Failed to start distribute workflow:", error);
    return NextResponse.json({ error: "Failed to start workflow" }, { status: 500 });
  }
}
