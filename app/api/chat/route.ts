import { withAuth, AuthenticatedRequest } from "@/lib/guards";
import { chat } from "@/lib/modules/ai/assistant";

async function handler(req: AuthenticatedRequest) {
  try {
    const body = await req.json();
    const messages = body.messages;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "GROQ_API_KEY not configured",
          message: "The AI assistant is temporarily unavailable. Please configure GROQ_API_KEY.",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Convert messages to the format expected by the AI SDK
    // Handle both {role, content} and {role, parts} formats
    const convertedMessages = messages.map((msg: { role: string; content?: string; parts?: Array<{type: string; text?: string}> }) => {
      let textContent = "";

      if (msg.content && typeof msg.content === "string") {
        textContent = msg.content;
      } else if (msg.parts && Array.isArray(msg.parts)) {
        textContent = msg.parts
          .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
          .map(p => p.text)
          .join("");
      }

      return {
        role: msg.role as "user" | "assistant" | "system",
        content: textContent,
      };
    });

    const result = await chat(convertedMessages);

    // Return as a data stream response for the useChat hook
    return result.toDataStreamResponse();
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    const err = error as { message?: string };
    return new Response(
      JSON.stringify({
        error: "Chat failed",
        message: err.message || "An error occurred while processing your request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export const POST = withAuth(handler);
