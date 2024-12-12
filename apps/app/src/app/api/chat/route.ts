import type { CoreMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: CoreMessage[] };

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system:
      "You are a helpful Bible study assistant. Help users understand Biblical concepts, passages, and their historical context. Always strive to be accurate and respectful.",
    messages,
  });

  return result.toDataStreamResponse();
}
