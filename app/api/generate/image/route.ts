import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/guards";
import { generateAndStore, IMAGE_MODELS, getAvailableModels, getModelPrice, DIMENSION_PRESETS } from "@/lib/modules/generation/generation";
import { getCreditCost } from "@/lib/x402";
import prisma from "@/lib/prisma/client";

async function handler(req: AuthenticatedRequest) {
  try {
    const { prompt, width, height, modelId = "imagen-4.0" } = await req.json();
    
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const modelConfig = IMAGE_MODELS[modelId];
    if (!modelConfig) {
      return NextResponse.json({ 
        error: "Invalid model", 
        availableModels: Object.keys(IMAGE_MODELS) 
      }, { status: 400 });
    }

    const costCents = getCreditCost("generate-image", modelConfig.modelId);
    const priceUSD = getModelPrice(modelId);

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { credits: true },
    });

    if (!user || user.credits < costCents) {
      return NextResponse.json({ 
        error: "Insufficient credits", 
        required: costCents,
        priceUSD,
        current: user?.credits || 0 
      }, { status: 402 });
    }

    const generation = await generateAndStore({
      userId: req.userId,
      prompt,
      width,
      height,
      modelId,
    });

    return NextResponse.json({ 
      success: true,
      jobId: generation.id,
      imageUrl: generation.imageUrl,
      creditsUsed: costCents,
      priceUSD,
      model: modelId,
    });
  } catch (error: unknown) {
    console.error("Generate Image API Error:", error);
    const err = error as { message?: string };
    return NextResponse.json({
      error: err.message || "Internal server error"
    }, { status: 500 });
  }
}

export const POST = withAuth(handler);

export async function GET() {
  return NextResponse.json({
    models: getAvailableModels(),
    dimensionPresets: DIMENSION_PRESETS,
  });
}