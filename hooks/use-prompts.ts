import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createMarketplaceTransaction, confirmTx } from "@/lib/solana/transactions";
import type { PromptListing, User } from "@prisma/client";

export type PromptListingWithRelations = PromptListing & {
  user: Pick<User, "id" | "walletAddress">;
};

interface BuyPromptError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export function useBuyPromptMutation() {
  const queryClient = useQueryClient();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  return useMutation({
    mutationFn: async (promptListing: PromptListingWithRelations) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const transaction = createMarketplaceTransaction({
        publicKey,
        sellerAddress: promptListing.user.walletAddress,
        priceSOL: promptListing.priceSOL,
      });

      const signature = await sendTransaction(transaction, connection);
      await confirmTx(connection, signature);

      const res = await axios.post("/api/marketplace/prompts/buy", {
        promptId: promptListing.id,
        txSignature: signature
      });

      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Prompt purchased!");
        toast.info(`Purchased Prompt: ${data.promptText}`);
        queryClient.invalidateQueries({ queryKey: ["prompts"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
    onError: (error: unknown) => {
      console.error("Buy prompt error:", error);
      const err = error as BuyPromptError;
      toast.error(err.response?.data?.error || "Purchase failed. Check your wallet balance.");
    },
  });
}
