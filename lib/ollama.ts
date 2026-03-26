import { createOllama } from 'ollama-ai-provider';
import { generateText, streamText, type LanguageModel } from 'ai';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";

const ollama = createOllama({
  baseURL: `${OLLAMA_BASE_URL}/api`,
});

export const enhancePrompt = async (prompt: string) => {
  const { text } = await generateText({
    model: ollama(OLLAMA_MODEL) as unknown as LanguageModel,
    system: "You are a professional AI image prompt engineer. Your job is to take a simple prompt from the user and enhance it with artistic details, lighting, camera settings, and stylistic keywords to produce a high-quality image. Return only the enhanced prompt, no other text.",
    prompt: prompt,
  });
  return text;
};

export const streamEnhancedPrompt = async (prompt: string) => {
  return streamText({
    model: ollama(OLLAMA_MODEL) as unknown as LanguageModel,
    system: "You are a professional AI image prompt engineer. Your job is to take a simple prompt from the user and enhance it with artistic details, lighting, camera settings, and stylistic keywords to produce a high-quality image. Return only the enhanced prompt, no other text.",
    prompt: prompt,
  });
};
