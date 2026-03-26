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

    const { listingId } = await req.json();

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { nft: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.userId !== session.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await prisma.listing.update({
      where: { id: listingId },
      data: { status: "CANCELLED" },
    });

    await prisma.nFT.update({
      where: { id: listing.nftId },
      data: { status: "MINTED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delist NFT API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}