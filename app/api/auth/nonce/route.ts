import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
   
    const nonce = crypto.randomBytes(16).toString("base64");
    session.nonce = nonce;
    await session.save();
   
    return NextResponse.json({ nonce });
  } catch (error) {
    console.error("Nonce generation error:", error);
    return NextResponse.json({ error: "Failed to generate nonce" }, { status: 500 });
  }
}
