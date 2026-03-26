import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/guards";
import prisma from "@/lib/prisma/client";

async function handler(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    
    const generation = await prisma.generation.findUnique({
      where: { id: jobId }
    });

    if (!generation) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 });
    }

    if (generation.userId !== req.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ 
      status: generation.status, 
      imageUrl: generation.imageUrl 
    });
  } catch (error) {
    console.error("Status API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = withAuth(handler);
