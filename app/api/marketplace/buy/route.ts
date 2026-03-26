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

    const { listingId, txSignature } = await req.json();
    
    // Fetch listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId, status: "ACTIVE" },
      include: { nft: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.userId === session.userId) {
      return NextResponse.json({ error: "Cannot buy your own listing" }, { status: 400 });
    }

    // Verify transaction on-chain
    const { Connection } = await import("@solana/web3.js");
    const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com", "confirmed");
    const tx = await connection.getTransaction(txSignature, { commitment: "confirmed", maxSupportedTransactionVersion: 0 });

    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Verify amount (approximate check for combined payments)
    const totalSent = (tx.meta?.preBalances[0] || 0) - (tx.meta?.postBalances[0] || 0);
    const expectedLamports = listing.priceSOL * 1_000_000_000;

    if (totalSent < expectedLamports) {
       return NextResponse.json({ error: "Insufficient payment amount" }, { status: 400 });
    }

    // Update NFT owner
    await prisma.nFT.update({
      where: { id: listing.nftId },
      data: { userId: session.userId, status: "MINTED" }, // Status resets to MINTED but owned by buyer
    });

    // Close listing
    await prisma.listing.update({
      where: { id: listingId },
      data: { 
        status: "SOLD",
        txSignature: txSignature,
        buyerWallet: session.walletAddress,
        soldAt: new Date()
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Buy NFT API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
