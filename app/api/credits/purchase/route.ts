import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma/client";
import { Connection, PublicKey } from "@solana/web3.js";

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

const CREDIT_PACKS = [
  { id: "starter", credits: 100, priceSOL: 0.05 }, // ~10 USD at 200/SOL
  { id: "creator", credits: 500, priceSOL: 0.2 }, // ~40 USD
  { id: "studio", credits: 1500, priceSOL: 0.5 }, // ~100 USD
];

export async function POST(req: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { txSignature, packId } = await req.json();
    const pack = CREDIT_PACKS.find(p => p.id === packId);
    
    if (!pack) {
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }

    // Verify transaction on-chain
    const connection = new Connection(SOLANA_RPC_URL, "confirmed");
    const tx = await connection.getTransaction(txSignature, { commitment: "confirmed", maxSupportedTransactionVersion: 0 });

    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Basic verification: correct amount and recipient
    const treasuryWallet = process.env.NEXT_PUBLIC_TREASURY_WALLET;
    
    // Check if enough SOL was sent (allowing for small fee variance)
    const solReceived = (tx.meta?.postBalances[1] || 0) - (tx.meta?.preBalances[1] || 0);
    const expectedLamports = pack.priceSOL * 1_000_000_000;

    if (solReceived < expectedLamports * 0.98) { // 2% tolerance for math/fees
       return NextResponse.json({ error: "Insufficient payment amount" }, { status: 400 });
    }

    // verify recipient is our treasury
    const accountKeys = tx.transaction.message.staticAccountKeys;
    const recipient = accountKeys && accountKeys.length > 1 ? accountKeys[1].toBase58() : "";
    if (treasuryWallet && recipient !== treasuryWallet) {
       return NextResponse.json({ error: "Invalid recipient" }, { status: 400 });
    }

    // Add credits to user
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        credits: { increment: pack.credits },
      },
    });

    // Record transaction
    await prisma.creditTransaction.create({
      data: {
        userId: session.userId,
        amount: pack.credits,
        type: "PURCHASE",
        txSignature: txSignature,
      },
    });

    return NextResponse.json({ success: true, credits: pack.credits });
  } catch (error) {
    console.error("Credit Purchase API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
