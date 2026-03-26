import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  
  if (!session.userId) {
    return NextResponse.json({ user: null });
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  
  return NextResponse.json({ user });
}
