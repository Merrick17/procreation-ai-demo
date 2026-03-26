import prisma from "@/lib/prisma/client";
import { MarketplaceList } from "@/components/marketplace/marketplace-list";

export default async function MarketplacePage() {
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

  return (
    <div className="container mx-auto py-10 px-6">
       <MarketplaceList initialListings={listings} />
    </div>
  );
}
