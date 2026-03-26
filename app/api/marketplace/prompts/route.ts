import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET() {
  try {
    const prompts = await prisma.promptListing.findMany({
      where: { status: "ACTIVE" },
      include: { user: { select: { walletAddress: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error("Prompt Listings API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}