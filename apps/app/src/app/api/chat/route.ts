import type { Message } from "ai";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";

import { createChat, updateChat } from "~/lib/actions/chat";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, studyId, chatId } = (await req.json()) as {
    messages: Message[];
    studyId: string;
    chatId?: string;
  };

  const coreMessages = convertToCoreMessages(messages);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system:
      "You are a helpful Bible study assistant. Help users understand Biblical concepts, passages, and their historical context. Always strive to be accurate and respectful.",
    messages: coreMessages,
    onFinish: async ({ response }) => {
      const newMessages = response.messages;

      if (chatId) {
        // Update existing chat with new messages
        await updateChat({
          id: chatId,
          messages: newMessages,
        });
      } else {
        // Create new chat with all messages
        await createChat({
          studyId,
          messages: [...messages, ...newMessages],
        });
      }
    },
  });

  return result.toDataStreamResponse();
}
