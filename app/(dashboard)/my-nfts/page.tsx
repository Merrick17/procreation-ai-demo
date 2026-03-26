import prisma from "@/lib/prisma/client";
import { MyNFTsList } from "@/components/nft/my-nfts-list";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MyNFTsPage() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  
  if (!session.userId) {
    redirect("/");
  }

  const nfts = await prisma.nFT.findMany({
    where: { userId: session.userId },
    include: {
      generation: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto py-10 px-6">
       <MyNFTsList initialNfts={nfts} />
    </div>
  );
}
