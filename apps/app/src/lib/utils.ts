import type {
  CoreAssistantMessage,
  CoreMessage,
  CoreToolMessage,
  Message,
  ToolInvocation,
} from '@lamp/ai';
import type { Message as DBMessage } from '@lamp/db/schema';
import type { User } from '@lamp/supabase';

export function getNameFromUser(user: User) {
  const meta = user.user_metadata;
  if (typeof meta.name === 'string') {
    return meta.name;
  }
  if (typeof meta.full_name === 'string') {
    return meta.full_name;
  }
  if (typeof meta.user_name === 'string') {
    return meta.user_name;
  }
  return 'User';
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Message[];
}): Message[] {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: 'result',
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
      };
    }

    return message;
  });
}

export function convertToUIMessages(messages: DBMessage[]): Message[] {
  return messages.reduce((chatMessages: Message[], message) => {
    if (message.role === 'tool') {
      const toolMessage = message as unknown as CoreToolMessage;
      return addToolMessageToChat({
        toolMessage,
        messages: chatMessages,
      });
    }

    let textContent = '';
    let toolInvocations: ToolInvocation[] | undefined;

    if (typeof message.content === 'string') {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === 'text') {
          textContent += content.text;
        } else if (content.type === 'tool-call') {
          if (!toolInvocations) {
            toolInvocations = [];
          }
          toolInvocations.push({
            state: 'call',
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        }
      }
    }

    chatMessages.push({
      id: message.id,
      role: message.role as Message['role'],
      content: textContent,
      ...(toolInvocations ? { toolInvocations } : {}),
    });

    return chatMessages;
  }, []);
}

export function sanitizeResponseMessages(
  messages: (CoreToolMessage | CoreAssistantMessage)[]
): (CoreToolMessage | CoreAssistantMessage)[] {
  const toolResultIds: string[] = [];

  for (const message of messages) {
    if (message.role === 'tool') {
      for (const content of message.content) {
        if (content.type === 'tool-result') {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== 'assistant') {
      return message;
    }

    if (typeof message.content === 'string') {
      return message;
    }

    const sanitizedContent = message.content.filter((content) => {
      if (content.type === 'tool-call') {
        return toolResultIds.includes(content.toolCallId);
      }
      if (content.type === 'text') {
        return content.text.length > 0;
      }
      return true;
    });

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0
  );
}

export function sanitizeUIMessages(messages: Message[]): Message[] {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== 'assistant') {
      return message;
    }

    if (!message.toolInvocations) {
      return message;
    }

    const toolResultIds: string[] = [];

    for (const toolInvocation of message.toolInvocations) {
      if (toolInvocation.state === 'result') {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedToolInvocations = message.toolInvocations.filter(
      (toolInvocation) =>
        toolInvocation.state === 'result' ||
        toolResultIds.includes(toolInvocation.toolCallId)
    );

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations,
    };
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) =>
      message.content.length > 0 ||
      (message.toolInvocations && message.toolInvocations.length > 0)
  );
}

export function getMostRecentUserMessage(messages: CoreMessage[]) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}
