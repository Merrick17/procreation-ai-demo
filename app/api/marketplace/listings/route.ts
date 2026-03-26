import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: "ACTIVE" },
      include: {
        nft: {
          include: {
            generation: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Marketplace Listings API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
