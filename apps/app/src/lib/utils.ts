import type { Message } from "ai";

import type { User } from "@lamp/supabase/types";

export function getNameFromUser(user: User) {
  const meta = user.user_metadata;
  if (typeof meta.name === "string") return meta.name;
  if (typeof meta.full_name === "string") return meta.full_name;
  if (typeof meta.user_name === "string") return meta.user_name;
  return "User";
}

export function sanitizeUIMessages(messages: Message[]): Message[] {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (!message.toolInvocations) return message;

    const toolResultIds: string[] = [];

    for (const toolInvocation of message.toolInvocations) {
      if (toolInvocation.state === "result") {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedToolInvocations = message.toolInvocations.filter(
      (toolInvocation) =>
        toolInvocation.state === "result" ||
        toolResultIds.includes(toolInvocation.toolCallId),
    );

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations,
    };
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) =>
      message.content.length > 0 ||
      (message.toolInvocations && message.toolInvocations.length > 0),
  );
}
