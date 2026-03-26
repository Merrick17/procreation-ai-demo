import { groq } from "@ai-sdk/groq";
import { streamText, generateText, tool } from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma/client";
import { getAvailableModels, IMAGE_MODELS, getModelPrice } from "@/lib/modules/generation/generation";
import { getCreditCost } from "@/lib/x402";

const model = groq("llama-3.3-70b-versatile");

interface SimpleMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function chat(messages: SimpleMessage[]) {
  const modelsInfo = Object.entries(IMAGE_MODELS).map(([id, config]) => {
    const price = getModelPrice(id);
    const costCents = getCreditCost("generate-image", config.modelId);
    return `- ${id}: ${config.provider} (${price} / ${costCents} credits)`;
  }).join("\n");

  return streamText({
    model,
    messages,
    system: `You are the Procreation AI Assistant. You help users generate art, manage their NFTs, and understand the platform. You are technical, creative, and concise.

Available image generation models:
${modelsInfo}

You can help users with:
- Creating and enhancing image generation prompts
- Choosing the best model for their needs
- Managing their NFT collection
- Understanding platform features and credits`,
  });
}

export async function enhancePrompt(prompt: string) {
  const { text } = await generateText({
    model,
    prompt: `Enhance the following image generation prompt to be more descriptive and artistic. Include details about:
- Lighting and atmosphere
- Composition and framing
- Color palette and mood
- Art style and technique
- Camera settings if applicable

Original prompt: "${prompt}"

Provide only the enhanced prompt text, no explanations.`,
  });
  return text;
}

export async function suggestModel(useCase: string) {
  const modelsInfo = Object.entries(IMAGE_MODELS).map(([id, config]) => {
    const price = getModelPrice(id);
    const costCents = getCreditCost("generate-image", config.modelId);
    return `- ${id} (${config.provider}, ${price}, ${costCents} credits)`;
  }).join("\n");

  const { text } = await generateText({
    model,
    prompt: `Based on the following use case, recommend the best image generation model from these options:
${modelsInfo}

Use case: ${useCase}

Respond with just the model ID and a brief reason.`,
  });
  return text;
}