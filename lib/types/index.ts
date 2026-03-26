import type { PromptListing, CreditTransaction, User, Listing, NFT, Generation } from "@prisma/client";

export type PromptWithSeller = PromptListing & {
  user: Pick<User, "walletAddress">;
};

export type TransactionWithUser = CreditTransaction & {
  user: User | null;
};

export type ListingWithNFT = Listing & {
  nft: NFT & { generation: Generation };
};

export interface ApiErrorResponse {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

export interface GenerationModel {
  id: string;
  provider: string;
  priceUSD: string;
  aspectRatios?: string[];
}

export interface GenerationParams {
  prompt: string;
  width: number;
  height: number;
  modelId: string;
  steps?: number;
  cfg?: number;
}

export interface StylePreset {
  id: string;
  label: string;
}

export interface AspectRatio {
  label: string;
  w: number;
  h: number;
}

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface CreditPack {
  id: string;
  credits: number;
  priceUSD: number;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  borderColor: string;
  popular?: boolean;
  features: string[];
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}