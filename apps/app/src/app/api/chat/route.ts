import type { Message } from '@lamp/ai';
import {
  StreamData,
  convertToCoreMessages,
  customModel,
  smoothStream,
  streamText,
} from '@lamp/ai';
import { DEFAULT_MODEL_NAME, models } from '@lamp/ai/models';
import { systemPrompt } from '@lamp/ai/prompts';
import {
  createChat,
  deleteChatById,
  getChatById,
  getFirstMessageByChatId,
  saveMessages,
  updateChatTitleById,
} from '@lamp/db/queries';
import type { Chat } from '@lamp/db/schema';
import { createClient } from '@lamp/supabase/server';
import { captureException } from '@sentry/nextjs';

import { generateTitleFromUserMessage } from '~/lib/actions/chat';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '~/lib/utils';

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    studyId,
    chatId,
    modelId = DEFAULT_MODEL_NAME,
  } = (await req.json()) as {
    messages: Message[];
    studyId: string;
    chatId?: string;
    modelId?: string;
  };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const model = models.find((m) => m.id === modelId);

  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  interface ChatResponse {
    chat: Chat | undefined;
  }

  let chatData: ChatResponse = { chat: undefined };

  if (chatId) {
    // If chatId provided, try to get existing chat
    chatData = await getChatById({ chatId, userId: user.id });
  }

  // Create new chat if either no chatId was provided or chat lookup failed
  if (!chatId || !chatData.chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    chatData = await createChat({
      newChat: { studyId, title },
      userId: user.id,
    });

    if (!chatData.chat) {
      return new Response('Failed to create chat', { status: 500 });
    }
  }

  const chat = chatData.chat;

  const userMessageId = generateUUID();

  // Check if this is the first message using our query function
  const { message: firstMessage } = await getFirstMessageByChatId({
    id: chat.id,
  });
  const isFirstMessage = !firstMessage;

  // If this is first message, generate and update title
  if (isFirstMessage) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await updateChatTitleById({
      chatId: chat.id,
      title,
      userId: user.id,
    });
  }

  await saveMessages({
    messages: [
      {
        ...userMessage,
        content: userMessage.content,
        id: userMessageId,
        chatId: chat.id,
      },
    ],
  });

  const streamingData = new StreamData();

  streamingData.append({
    type: 'user-message-id',
    content: userMessageId,
  });

  const result = streamText({
    model: customModel(model.apiIdentifier),
    system: systemPrompt,
    messages: coreMessages,
    maxSteps: 5,
    // experimental_activeTools: [],
    // tools: {},
    experimental_transform: smoothStream(),
    onFinish: async ({ response }) => {
      if (user.id) {
        try {
          const responseMessagesWithoutIncompleteToolCalls =
            sanitizeResponseMessages(response.messages);

          await saveMessages({
            messages: responseMessagesWithoutIncompleteToolCalls.map(
              (message) => {
                const messageId = generateUUID();

                if (message.role === 'assistant') {
                  streamingData.appendMessageAnnotation({
                    messageIdFromServer: messageId,
                  });
                }

                return {
                  id: messageId,
                  chatId: chat.id,
                  role: message.role,
                  content: message.content,
                };
              }
            ),
          });
        } catch (error) {
          captureException(error);
        }
      }

      streamingData.close();
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  return result.toDataStreamResponse({
    data: streamingData,
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { chat } = await getChatById({ chatId: id, userId: user.id });

    if (!chat) {
      return new Response('Chat not found', { status: 404 });
    }

    // Delete chat will cascade delete messages due to foreign key constraint
    await deleteChatById({ chatId: id, userId: user.id });

    return new Response('Chat deleted', { status: 200 });
  } catch (_error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
