import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import type { GenerationParams, GenerationModel, ApiErrorResponse } from "@/lib/types";

export interface GenerateResponse {
  success: boolean;
  jobId: string;
  imageUrl?: string;
  creditsUsed: number;
  priceUSD: string;
  model: string;
}

export function useGenerateImageMutation() {
  const queryClient = useQueryClient();

  return useMutation<GenerateResponse, ApiErrorResponse, GenerationParams>({
    mutationFn: async (params) => {
      const res = await axios.post<GenerateResponse>("/api/generate/image", params);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Generation started!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Generation failed. Check your credits.");
    },
  });
}

export interface EnhancePromptResponse {
  enhancedPrompt: string;
}

export function useEnhancePromptMutation() {
  return useMutation<EnhancePromptResponse, ApiErrorResponse, string>({
    mutationFn: async (prompt) => {
      const res = await axios.post<EnhancePromptResponse>("/api/generate/enhance-prompt", { prompt });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Prompt enhanced!");
    },
    onError: () => {
      toast.error("Failed to enhance prompt");
    },
  });
}

export interface GenerationStatusResponse {
  status: "PENDING" | "GENERATING" | "DONE" | "FAILED";
  imageUrl?: string;
  error?: string;
}

export function useGenerationStatus(jobId: string | null) {
  return useQuery<GenerationStatusResponse>({
    queryKey: ["generation-status", jobId],
    queryFn: async () => {
      const res = await axios.get<GenerationStatusResponse>(`/api/generate/status/${jobId}`);
      return res.data;
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
        if (query.state.data?.status === "DONE" || query.state.data?.status === "FAILED") {
            return false;
        }
        return 3000;
    },
  });
}

export function useAvailableModels() {
  return useQuery<GenerationModel[]>({
    queryKey: ["available-models"],
    queryFn: async () => {
      const res = await axios.get<{ models: GenerationModel[] }>("/api/generate/image");
      return res.data.models;
    },
  });
}
