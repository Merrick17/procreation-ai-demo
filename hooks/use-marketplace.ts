import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createMarketplaceTransaction, confirmTx } from "@/lib/solana/transactions";
import type { Listing, NFT, Generation, User } from "@prisma/client";

export type ListingWithRelations = Listing & {
  nft: NFT & { generation: Generation };
  user: Pick<User, "id" | "walletAddress">;
};

export type MarketplaceListing = ListingWithRelations & {
  nft: NFT & { 
    generation: Generation;
    metadata?: {
      attributes?: Array<{ trait_type: string; value: string }>;
    };
  };
};

interface BuyListingError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export function useBuyListingMutation() {
  const queryClient = useQueryClient();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  return useMutation({
    mutationFn: async (listing: ListingWithRelations) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const transaction = createMarketplaceTransaction({
        publicKey,
        sellerAddress: listing.user.walletAddress,
        priceSOL: listing.priceSOL,
      });

      const signature = await sendTransaction(transaction, connection);
      await confirmTx(connection, signature);

      const res = await axios.post("/api/marketplace/buy", {
        listingId: listing.id,
        txSignature: signature
      });

      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Purchase successful!");
        queryClient.invalidateQueries({ queryKey: ["listings"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
    onError: (error: unknown) => {
      console.error("Buy error:", error);
      const err = error as BuyListingError;
      toast.error(err.response?.data?.error || "Purchase failed. Check your wallet balance.");
    },
  });
}
