import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function useListNFTMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nftId, priceSOL }: { nftId: string; priceSOL: number }) => {
      const res = await axios.post("/api/marketplace/list", { nftId, priceSOL });
      return res.data;
    },
    onSuccess: () => {
      toast.success("NFT listed successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-nfts"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: () => {
      toast.error("Failed to list NFT");
    },
  });
}
