import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import nacl from "tweetnacl";
import bs58 from "bs58";
import prisma from "@/lib/prisma/client";

export async function POST(req: Request) {
  try {
    const { signature, publicKey } = await req.json();
    
    // Validate input
    if (!signature || !publicKey) {
      return NextResponse.json({ error: "Missing signature or public key" }, { status: 400 });
    }
    
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    
    if (!session.nonce) {
      return NextResponse.json({ error: "Missing nonce" }, { status: 400 });
    }
    
    const message = `Sign in to Procreation AI: ${session.nonce}`;
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(publicKey);
    
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
    
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    
    // Create or fetch user
    let user = await prisma.user.findUnique({
      where: { walletAddress: publicKey },
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: publicKey,
          credits: 10, // Initial free credits
        },
      });
    }
    
    session.userId = user.id;
    session.walletAddress = user.walletAddress;
    // Clear nonce after use
    session.nonce = undefined;
    await session.save();
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("SIWS Verification Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
