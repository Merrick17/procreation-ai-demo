export const CREDIT_PRICING: Record<string, Record<string, string> | string> = {
  "generate-image": {
    "imagen-4.0": "$0.05",
    "imagen-4.0-ultra": "$0.08",
    "imagen-4.0-fast": "$0.03",
    "gpt-image-1": "$0.04",
    "dall-e-3": "$0.06",
    "flux-1.1-pro": "$0.04",
    "flux-dev": "$0.03",
    "flux-schnell": "$0.02",
    "recraft-v3": "$0.05",
    "ideogram-v2": "$0.03",
    "stable-diffusion-3.5": "$0.04",
    "flux-free": "$0.00",
    "stable-diffusion-v3-free": "$0.00",
    // Hugging Face Models
    "sdxl-base-1.0": "$0.02",
    "sd-2-1": "$0.015",
    "sd-v1-5": "$0.01",
    "flux-schnell-hf": "$0.02",
    "flux-dev-hf": "$0.03",
    "sdxl-lightning": "$0.015",
    "realvis-xl": "$0.025",
    "openjourney": "$0.015",
    "animagine-xl": "$0.02",
    "kandinsky-3": "$0.025",
    "playground-v2.5": "$0.03",
    "latent-consistency": "$0.01",
    "anything-v5": "$0.015",
    "dreamshaper": "$0.015",
  },
  "enhance-prompt": "$0.002",
  "mint-nft": "$0.00",
  "chat": "$0.001",
};

export function getCreditCost(resource: string, modelId?: string): number {
  const pricing = CREDIT_PRICING;
  let costUSD = 0.01;

  if (resource === "generate-image" && modelId && typeof pricing["generate-image"] === "object") {
    const priceStr = (pricing["generate-image"] as Record<string, string>)[modelId];
    if (priceStr) {
      costUSD = parseFloat(priceStr.replace("$", ""));
    }
  } else if (typeof pricing[resource] === "string") {
    costUSD = parseFloat((pricing[resource] as string).replace("$", ""));
  }

  return costUSD * 100;
}

export function getPriceUSD(resource: string, modelId?: string): string {
  const pricing = CREDIT_PRICING;
  
  if (resource === "generate-image" && modelId && typeof pricing["generate-image"] === "object") {
    return (pricing["generate-image"] as Record<string, string>)[modelId] || "$0.05";
  }
  
  if (typeof pricing[resource] === "string") {
    return pricing[resource] as string;
  }
  
  return "$0.01";
}

export function formatUSD(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export const SOLANA_NETWORK = process.env.SOLANA_NETWORK || "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";
export const SOLANA_PAYMENT_WALLET = process.env.SOLANA_PAYMENT_WALLET || "";

interface PaymentRequirement {
  scheme: string;
  network: string;
  price: string;
  payTo: string;
}

export const PAYMENT_REQUIREMENTS: Record<string, { accepts: PaymentRequirement[] }> = {
  "/api/generate/image": {
    accepts: [
      {
        scheme: "exact",
        network: SOLANA_NETWORK,
        price: "$0.05",
        payTo: SOLANA_PAYMENT_WALLET,
      },
    ],
  },
  "/api/generate/enhance-prompt": {
    accepts: [
      {
        scheme: "exact",
        network: SOLANA_NETWORK,
        price: "$0.002",
        payTo: SOLANA_PAYMENT_WALLET,
      },
    ],
  },
  "/api/chat": {
    accepts: [
      {
        scheme: "exact",
        network: SOLANA_NETWORK,
        price: "$0.001",
        payTo: SOLANA_PAYMENT_WALLET,
      },
    ],
  },
};