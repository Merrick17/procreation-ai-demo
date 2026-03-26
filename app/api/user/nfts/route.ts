import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma/client";

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const nfts = await prisma.nFT.findMany({
      where: { userId: session.userId },
      include: { generation: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ nfts });
  } catch (error) {
    console.error("User NFTs API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
