import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma/client";
import { Connection } from "@solana/web3.js";

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

export async function POST(req: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mintAddress, metadataUri, generationId, txid, name, description, type } = await req.json();
    
    if (!mintAddress || !txid) {
      return NextResponse.json({ error: "Missing mintAddress or txid" }, { status: 400 });
    }

    // verify generation belongs to user
    const generation = await prisma.generation.findUnique({
      where: { id: generationId, userId: session.userId }
    });

    if (!generation) {
       return NextResponse.json({ error: "Generation not found" }, { status: 404 });
    }

    const userCheck = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { credits: true }
    });

    if (!userCheck || userCheck.credits < 15) {
      return NextResponse.json({ error: "Insufficient credits (15 required)" }, { status: 402 });
    }

    // Save NFT record and deduct credits in a transaction
    const savedNft = await prisma.$transaction(async (tx) => {
      // Deduct credits
      const user = await tx.user.update({
        where: { id: session.userId },
        data: { credits: { decrement: 15 } }
      });

      if (user.credits < 0) {
        throw new Error("Insufficient credits");
      }

      // Record transaction
      await tx.creditTransaction.create({
        data: {
          userId: session.userId!,
          amount: -15,
          type: "SPEND",
          txSignature: txid
        }
      });

      // Create NFT
      return await (tx as unknown as { nFT: typeof prisma.nFT }).nFT.create({
        data: {
          userId: session.userId!,
          generationId: generationId,
          mintAddress: mintAddress,
          metadataUri: metadataUri,
          name: name || "Generated NFT",
          description: description,
          type: (type || "IMAGE").toUpperCase(),
          status: "MINTED",
        },
      });
    });

    return NextResponse.json({ 
      success: true, 
      nft: savedNft,
      txid 
    });
  } catch (error) {
    console.error("NFT Confirm Mint API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}