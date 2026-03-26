import { experimental_generateImage as generateImage } from "ai";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { replicate } from "@ai-sdk/replicate";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma/client";
import { getCreditCost, getPriceUSD } from "@/lib/x402";

export type ImageProvider = "google" | "openai" | "replicate" | "fal" | "pollinations" | "huggingface";

export interface ImageModelConfig {
  provider: ImageProvider;
  model: string;
  modelId: string;
  aspectRatios?: string[];
}

export const IMAGE_MODELS: Record<string, ImageModelConfig> = {
  "imagen-4.0": {
    provider: "google",
    model: "imagen-4.0-generate-001",
    modelId: "imagen-4.0",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "imagen-4.0-ultra": {
    provider: "google",
    model: "imagen-4.0-ultra-generate-001",
    modelId: "imagen-4.0-ultra",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "imagen-4.0-fast": {
    provider: "google",
    model: "imagen-4.0-fast-generate-001",
    modelId: "imagen-4.0-fast",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "gpt-image-1": {
    provider: "openai",
    model: "gpt-image-1",
    modelId: "gpt-image-1",
    aspectRatios: ["1:1", "3:4", "4:3", "16:9"],
  },
  "dall-e-3": {
    provider: "openai",
    model: "dall-e-3",
    modelId: "dall-e-3",
    aspectRatios: ["1:1", "1792:1024", "1024:1792"],
  },
  "flux-1.1-pro": {
    provider: "replicate",
    model: "black-forest-labs/flux-1.1-pro",
    modelId: "flux-1.1-pro",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "flux-dev": {
    provider: "replicate",
    model: "black-forest-labs/flux-dev",
    modelId: "flux-dev",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "flux-schnell": {
    provider: "replicate",
    model: "black-forest-labs/flux-schnell",
    modelId: "flux-schnell",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "recraft-v3": {
    provider: "replicate",
    model: "recraft-ai/recraft-v3",
    modelId: "recraft-v3",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "ideogram-v2": {
    provider: "replicate",
    model: "ideogram-ai/ideogram-v2-turbo",
    modelId: "ideogram-v2",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "stable-diffusion-3.5": {
    provider: "replicate",
    model: "stability-ai/stable-diffusion-3.5-large-turbo",
    modelId: "stable-diffusion-3.5",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  // Free models using Hugging Face (more reliable than Pollinations)
  "flux-free": {
    provider: "huggingface",
    model: "black-forest-labs/FLUX.1-schnell",
    modelId: "flux-free",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "stable-diffusion-v3-free": {
    provider: "huggingface",
    model: "stabilityai/stable-diffusion-xl-base-1.0",
    modelId: "stable-diffusion-v3-free",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  // Hugging Face Models
  "sdxl-base-1.0": {
    provider: "huggingface",
    model: "stabilityai/stable-diffusion-xl-base-1.0",
    modelId: "sdxl-base-1.0",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "sd-2-1": {
    provider: "huggingface",
    model: "stabilityai/stable-diffusion-2-1",
    modelId: "sd-2-1",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "sd-v1-5": {
    provider: "huggingface",
    model: "runwayml/stable-diffusion-v1-5",
    modelId: "sd-v1-5",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "flux-schnell-hf": {
    provider: "huggingface",
    model: "black-forest-labs/FLUX.1-schnell",
    modelId: "flux-schnell-hf",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "flux-dev-hf": {
    provider: "huggingface",
    model: "black-forest-labs/FLUX.1-dev",
    modelId: "flux-dev-hf",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "sdxl-lightning": {
    provider: "huggingface",
    model: "ByteDance/SDXL-Lightning",
    modelId: "sdxl-lightning",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "realvis-xl": {
    provider: "huggingface",
    model: "SG161222/RealVisXL_V4.0",
    modelId: "realvis-xl",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "openjourney": {
    provider: "huggingface",
    model: "prompthero/openjourney",
    modelId: "openjourney",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "animagine-xl": {
    provider: "huggingface",
    model: "cagliostrolab/animagine-xl-3.1",
    modelId: "animagine-xl",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "kandinsky-3": {
    provider: "huggingface",
    model: "kandinsky-community/kandinsky-3",
    modelId: "kandinsky-3",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "playground-v2.5": {
    provider: "huggingface",
    model: "playgroundai/playground-v2.5-1024px-aesthetic",
    modelId: "playground-v2.5",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "latent-consistency": {
    provider: "huggingface",
    model: "SimianLuo/LCM_Dreamshaper_v7",
    modelId: "latent-consistency",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "anything-v5": {
    provider: "huggingface",
    model: "stabilityai/anything-v5",
    modelId: "anything-v5",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
  "dreamshaper": {
    provider: "huggingface",
    model: "Lykon/DreamShaper",
    modelId: "dreamshaper",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"],
  },
};

function getModel(provider: ImageProvider, modelId: string) {
  switch (provider) {
    case "google":
      return google.image(modelId);
    case "openai":
      return openai.image(modelId);
    case "replicate":
      return replicate.image(modelId);
    default:
      return google.image("imagen-4.0-generate-001");
  }
}

// GCD helper for simplifying ratios
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Convert pixel dimensions to simplified aspect ratio
 * e.g., 512:512 -> 1:1, 1024:768 -> 4:3
 */
function pixelsToAspectRatio(width: number, height: number): string {
  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;
  return `${w}:${h}`;
}

/**
 * Find the closest supported aspect ratio for a given model
 */
function findClosestAspectRatio(
  width: number,
  height: number,
  supportedRatios: string[]
): string {
  // Map of common aspect ratios to their decimal values
  const ratioValues: Record<string, number> = {
    "1:1": 1,
    "3:4": 0.75,
    "4:3": 1.333,
    "9:16": 0.5625,
    "16:9": 1.778,
    "1792:1024": 1.75,
    "1024:1792": 0.571,
  };

  const targetRatio = width / height;
  let closestRatio = supportedRatios[0] || "1:1";
  let minDiff = Infinity;

  for (const ratio of supportedRatios) {
    const ratioValue = ratioValues[ratio] || 1;
    const diff = Math.abs(ratioValue - targetRatio);
    if (diff < minDiff) {
      minDiff = diff;
      closestRatio = ratio;
    }
  }

  return closestRatio;
}

/**
 * Get aspect ratio for a specific provider/model
 * Handles provider-specific quirks
 */
function getAspectRatioForModel(
  width: number | undefined,
  height: number | undefined,
  config: ImageModelConfig
): string | undefined {
  // If no dimensions provided, let the API use default
  if (!width || !height) return undefined;

  const supportedRatios = config.aspectRatios || ["1:1"];

  // Special handling for DALL-E 3 - uses resolution format
  if (config.provider === "openai" && config.modelId === "dall-e-3") {
    // DALL-E 3 uses specific resolutions: 1024x1024, 1792x1024, 1024x1792
    const targetRatio = width / height;
    if (targetRatio > 1.5) return "1792:1024";
    if (targetRatio < 0.7) return "1024:1792";
    return "1:1";
  }

  // Calculate simplified ratio from pixels
  const simplifiedRatio = pixelsToAspectRatio(width, height);

  // If the simplified ratio is supported, use it
  if (supportedRatios.includes(simplifiedRatio)) {
    return simplifiedRatio;
  }

  // Otherwise find the closest supported ratio
  return findClosestAspectRatio(width, height, supportedRatios);
}

export async function generateAndStore({
  userId,
  prompt,
  width,
  height,
  modelId = "imagen-4.0",
}: {
  userId: string;
  prompt: string;
  width?: number;
  height?: number;
  modelId?: string;
}) {
  const config = IMAGE_MODELS[modelId] || IMAGE_MODELS["imagen-4.0"];
  const costCents = getCreditCost("generate-image", config.modelId);
  const priceUSD = getPriceUSD("generate-image", config.modelId);
  
  let imageBase64: string | undefined;

  if (config.provider === "pollinations") {
    // Pollinations API - use query parameter format (more reliable than path)
    const seed = Math.floor(Math.random() * 1000000);

    // Pollinations supports specific models: 'flux', 'sdxl', 'turbo', 'pixart', 'dall-e-3'
    const modelMap: Record<string, string> = {
      "flux": "flux",
      "sdxl": "sdxl",
    };
    const pollModel = modelMap[config.model] || "flux";

    // Use query parameter format: https://image.pollinations.ai/prompt?prompt=...
    const params = new URLSearchParams({
      prompt,
      width: String(width || 1024),
      height: String(height || 1024),
      model: pollModel,
      seed: String(seed),
      nologo: "true",
      private: "true",
      enhance: "true",
    });

    const pollUrl = `https://image.pollinations.ai/prompt?${params.toString()}`;
    console.log("Pollinations URL:", pollUrl.substring(0, 100) + "...");

    const response = await fetch(pollUrl, {
      method: "GET",
      headers: {
        "Accept": "image/png,image/jpeg,image/*",
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "No error details");
      console.error("Pollinations API error:", response.status, errorText);
      throw new Error(
        `Pollinations API error (${response.status}): ${response.statusText}. ` +
        `The free Pollinations service may be temporarily unavailable or rate limited. ` +
        `Please try a different model like "imagen-4.0-fast" or "flux-schnell".`
      );
    }

    const buffer = await response.arrayBuffer();
    imageBase64 = Buffer.from(buffer).toString("base64");
  } else if (config.provider === "huggingface") {
    // Hugging Face Generation
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    if (!hfApiKey) {
      throw new Error("HUGGINGFACE_API_KEY not configured");
    }

    const apiUrl = `https://router.huggingface.co/hf-inference/models/${config.model}`;

    // Map aspect ratio to closest supported dimensions for HF models
    const supportedRatios = config.aspectRatios || ["1:1"];
    const aspectRatio = getAspectRatioForModel(width, height, config) || "1:1";
    const [ratioW, ratioH] = aspectRatio.split(":").map(Number);
    const baseSize = 1024;
    const aspectRatioDecimal = ratioW / ratioH;

    // Calculate dimensions maintaining the aspect ratio
    let finalWidth: number;
    let finalHeight: number;

    if (aspectRatioDecimal >= 1) {
      finalWidth = baseSize;
      finalHeight = Math.round(baseSize / aspectRatioDecimal);
    } else {
      finalHeight = baseSize;
      finalWidth = Math.round(baseSize * aspectRatioDecimal);
    }

    const payload = {
      inputs: prompt,
      parameters: {
        width: finalWidth,
        height: finalHeight,
        seed: Math.floor(Math.random() * 1000000),
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    const buffer = await response.arrayBuffer();
    imageBase64 = Buffer.from(buffer).toString("base64");
  } else {
    const model = getModel(config.provider, config.model);

    // Use the helper function to get the correct aspect ratio
    const aspectRatio = getAspectRatioForModel(width, height, config);

    const result = await generateImage({
      model,
      prompt,
      n: 1,
      aspectRatio: aspectRatio as `${number}:${number}` | undefined,
    });

    imageBase64 = result.images[0].base64;
  }

  if (!imageBase64) throw new Error("Generation failed: No image returned");

  const uploadRes = await cloudinary.uploader.upload(`data:image/png;base64,${imageBase64}`, {
    folder: "generations",
    public_id: `gen_${Date.now()}`,
  });

  const generation = await prisma.generation.create({
    data: {
      userId,
      prompt,
      creditsCost: costCents,
      imageUrl: uploadRes.secure_url,
      status: "DONE",
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: costCents } },
  });

  await prisma.creditTransaction.create({
    data: {
      userId,
      amount: -costCents,
      type: "SPEND",
    },
  });

  return { ...generation, priceUSD };
}

export function getAvailableModels() {
  return Object.entries(IMAGE_MODELS).map(([id, config]) => ({
    id,
    provider: config.provider,
    priceUSD: getPriceUSD("generate-image", config.modelId),
    aspectRatios: config.aspectRatios,
  }));
}

export function getModelPrice(modelId: string): string {
  const config = IMAGE_MODELS[modelId];
  if (!config) return "$0.05";
  return getPriceUSD("generate-image", config.modelId);
}

/**
 * Preset dimensions that map to supported aspect ratios
 * Use these to provide users with friendly size options
 */
export const DIMENSION_PRESETS: Record<string, { name: string; width: number; height: number; ratio: string }> = {
  "square": { name: "Square", width: 1024, height: 1024, ratio: "1:1" },
  "portrait": { name: "Portrait", width: 896, height: 1152, ratio: "3:4" },
  "landscape": { name: "Landscape", width: 1152, height: 896, ratio: "4:3" },
  "mobile-portrait": { name: "Mobile Portrait", width: 576, height: 1024, ratio: "9:16" },
  "mobile-landscape": { name: "Mobile Landscape", width: 1024, height: 576, ratio: "16:9" },
  "wide": { name: "Widescreen", width: 1024, height: 576, ratio: "16:9" },
  "tall": { name: "Tall", width: 576, height: 1024, ratio: "9:16" },
  "story": { name: "Story", width: 576, height: 1024, ratio: "9:16" },
  "banner": { name: "Banner", width: 1024, height: 576, ratio: "16:9" },
};

/**
 * Get preset dimensions for a specific aspect ratio
 * Useful for UI dropdowns showing size options
 */
export function getPresetsForRatio(ratio: string): Array<{ key: string; name: string; width: number; height: number }> {
  return Object.entries(DIMENSION_PRESETS)
    .filter(([_, preset]) => preset.ratio === ratio)
    .map(([key, preset]) => ({
      key,
      name: preset.name,
      width: preset.width,
      height: preset.height,
    }));
}

/**
 * Get available presets for a specific model
 * Returns presets that are compatible with the model's supported aspect ratios
 */
export function getModelDimensionPresets(modelId: string): Array<{ key: string; name: string; width: number; height: number; ratio: string }> {
  const config = IMAGE_MODELS[modelId];
  if (!config) return [DIMENSION_PRESETS["square"]];

  const supportedRatios = config.aspectRatios || ["1:1"];

  return Object.entries(DIMENSION_PRESETS)
    .filter(([_, preset]) => supportedRatios.includes(preset.ratio))
    .map(([key, preset]) => ({
      key,
      name: preset.name,
      width: preset.width,
      height: preset.height,
      ratio: preset.ratio,
    }));
}

/**
 * Find the best preset for given pixel dimensions
 * Returns the closest matching preset key
 */
export function findPresetForDimensions(width: number, height: number): string {
  const targetRatio = width / height;
  let closestPreset = "square";
  let minDiff = Infinity;

  for (const [key, preset] of Object.entries(DIMENSION_PRESETS)) {
    const presetRatio = preset.width / preset.height;
    const diff = Math.abs(presetRatio - targetRatio);
    if (diff < minDiff) {
      minDiff = diff;
      closestPreset = key;
    }
  }

  return closestPreset;
}