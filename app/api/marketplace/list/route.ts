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

    const { nftId, priceSOL } = await req.json();

    if (!nftId || !priceSOL) {
      return NextResponse.json({ error: "Missing nftId or price" }, { status: 400 });
    }

    const nft = await prisma.nFT.findUnique({
      where: { id: nftId },
      include: { listing: true },
    });

    if (!nft || nft.userId !== session.userId) {
      return NextResponse.json({ error: "NFT not found or not owned by you" }, { status: 404 });
    }

    if (nft.listing) {
      return NextResponse.json({ error: "NFT already listed" }, { status: 400 });
    }

    const listing = await prisma.listing.create({
      data: {
        userId: session.userId,
        nftId: nftId,
        priceSOL: priceSOL,
        status: "ACTIVE",
      },
    });

    await prisma.nFT.update({
      where: { id: nftId },
      data: { status: "LISTED" },
    });

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error("List NFT API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}