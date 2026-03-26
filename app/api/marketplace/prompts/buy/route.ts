import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma/client";
import { Connection } from "@solana/web3.js";

export async function POST(req: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { promptId, txSignature } = await req.json();

    const promptListing = await prisma.promptListing.findUnique({
      where: { id: promptId, status: "ACTIVE" },
      include: { user: true },
    });

    if (!promptListing) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    // Verify transaction on-chain
    const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com", "confirmed");
    const tx = await connection.getTransaction(txSignature, { commitment: "confirmed", maxSupportedTransactionVersion: 0 });

    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Verify amount (approximate check)
    const totalSent = (tx.meta?.preBalances[0] || 0) - (tx.meta?.postBalances[0] || 0);
    const expectedLamports = promptListing.priceSOL * 1_000_000_000;

    if (totalSent < expectedLamports * 0.98) {
       return NextResponse.json({ error: "Insufficient payment amount" }, { status: 400 });
    }

    // Record sale
    await prisma.promptListing.update({
      where: { id: promptId },
      data: { sales: { increment: 1 } },
    });

    // In a real app, we'd add this prompt to the buyer's library.
    // For now, we return the prompt text.
    return NextResponse.json({ success: true, promptText: promptListing.prompt });
  } catch (error) {
    console.error("Buy Prompt API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}