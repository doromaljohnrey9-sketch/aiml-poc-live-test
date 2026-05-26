import { start } from "workflow/api";
import { aimlRegenerate } from "@/workflows/regenerate/workflow";
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
    const { generatedContentId } = body;

    if (!generatedContentId) {
      return NextResponse.json(
        { error: "Missing required field: generatedContentId" },
        { status: 400 }
      );
    }

    // Trigger the regenerate workflow asynchronously
    await start(aimlRegenerate, [generatedContentId]);

    return NextResponse.json({
      message: "Regenerate workflow started",
      generatedContentId,
    });
  } catch (error) {
    console.error("Failed to start regenerate workflow:", error);
    return NextResponse.json({ error: "Failed to start workflow" }, { status: 500 });
  }
}
