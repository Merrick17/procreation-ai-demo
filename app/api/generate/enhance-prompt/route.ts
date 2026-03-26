import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/guards";
import { enhancePrompt } from "@/lib/modules/ai/assistant";

async function handler(req: AuthenticatedRequest) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const enhanced = await enhancePrompt(prompt);

    return NextResponse.json({ enhancedPrompt: enhanced });
  } catch (error: unknown) {
    console.error("Enhance Prompt API Error:", error);
    const err = error as { message?: string };
    return NextResponse.json({
      error: err.message || "Internal server error"
    }, { status: 500 });
  }
}

export const POST = withAuth(handler);
