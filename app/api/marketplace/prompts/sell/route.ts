import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, prompt, priceSOL, previewUrl, tags } = await req.json();

    if (!title || !prompt || !priceSOL) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const promptListing = await prisma.promptListing.create({
      data: {
        userId: session.userId,
        title,
        description,
        prompt,
        priceSOL,
        previewUrl,
        tags,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, prompt: promptListing });
  } catch (error) {
    console.error("Sell Prompt API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}