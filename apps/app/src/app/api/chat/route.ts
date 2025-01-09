import type { Message } from '@lamp/ai';
import {
  StreamData,
  convertToCoreMessages,
  customModel,
  streamText,
} from '@lamp/ai';
import {
  DEFAULT_MODEL_NAME,
  FREE_USAGE_LIMIT,
  PREMIUM_USAGE_LIMIT,
  models,
} from '@lamp/ai/models';
import { systemPrompt } from '@lamp/ai/prompts';
import { analytics } from '@lamp/analytics/posthog/server';
import {
  createChat,
  deleteChatById,
  getChatById,
  getFirstMessageByChatId,
  getProfileById,
  incrementLlmUsage,
  saveMessages,
  updateChatTitleById,
} from '@lamp/db/queries';
import type { Chat } from '@lamp/db/schema';
import { parseError } from '@lamp/observability/error';
import { createClient } from '@lamp/supabase/server';

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
    isFreePlan = false,
  } = (await req.json()) as {
    messages: Message[];
    studyId: string;
    chatId?: string;
    modelId?: string;
    isFreePlan?: boolean;
  };

  // 1. Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. Resolve which model is being used
  const model = models.find((m) => m.id === modelId);
  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  // Only check usage for free plan users
  if (isFreePlan) {
    // 3. Fetch user's Profile row to check usage
    const { profile } = await getProfileById({ id: user.id });
    if (!profile) {
      return new Response('Profile not found', { status: 404 });
    }

    // 4. Check usage to block if already at or above the limit
    const maxCalls = model.premium ? PREMIUM_USAGE_LIMIT : FREE_USAGE_LIMIT;
    const currentUsage = model.premium
      ? profile.premiumLlmUsage
      : profile.llmUsage;

    if (currentUsage >= maxCalls) {
      return new Response('Usage limit reached', { status: 403 });
    }
  }

  // 5. Convert messages, extract user's newest message
  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);
  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }
  const userMessageContent = userMessage.content;

  // 6. Chat creation / retrieval
  interface ChatResponse {
    chat: Chat | undefined;
  }
  let chatData: ChatResponse = { chat: undefined };

  if (chatId) {
    chatData = await getChatById({ chatId, userId: user.id });
  }

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

  // If this is first message, generate and update title
  const { message: firstMessage } = await getFirstMessageByChatId({
    id: chat.id,
  });
  const isFirstMessage = !firstMessage;
  if (isFirstMessage) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await updateChatTitleById({
      chatId: chat.id,
      title,
      userId: user.id,
    });
  }

  // Save user's new message
  await saveMessages({
    messages: [
      {
        ...userMessage,
        content: userMessageContent,
        id: userMessageId,
        chatId: chat.id,
      },
    ],
  });

  // 7. Start the performance timer
  const startTime = performance.now();

  // 8. Prepare streaming
  const streamingData = new StreamData();
  streamingData.append({
    type: 'user-message-id',
    content: userMessageId,
  });

  // 9. Stream the text; onFinish to do cost usage + analytics + usage increment
  const result = streamText({
    model: customModel(model.id),
    system: systemPrompt,
    messages: coreMessages,
    maxSteps: 5,
    // experimental_transform: smoothStream({
    //   delayInMs: 20, // TODO: defaults to 10ms, but not working with useScrollToBottom, is jumping around
    //   chunking: 'word',
    // }),
    onFinish: async ({ response, usage }) => {
      try {
        // 9.a) Save assistant messages
        const cleaned = sanitizeResponseMessages(response.messages);
        await saveMessages({
          messages: cleaned.map((msg) => ({
            id: generateUUID(),
            chatId: chat.id,
            role: msg.role,
            content: msg.content,
          })),
        });

        // 9.b) Stop the timer, compute response time
        const endTime = performance.now();
        const responseTimeMs = endTime - startTime;

        // 9.c) Calculate cost
        const inputCost = usage.promptTokens * model.inputCostPerToken;
        const outputCost = usage.completionTokens * model.outputCostPerToken;
        const totalCost = inputCost + outputCost;

        // 9.d) Increment usage by 1 here, so only "finished" calls count
        await incrementLlmUsage({
          userId: user.id,
          amount: 1,
          premium: model.premium,
        });

        // 9.e) Capture analytics
        analytics.capture({
          event: 'chat_completion',
          distinctId: user.id,
          properties: {
            model: model.id,
            prompt: userMessageContent,
            prompt_tokens: usage.promptTokens,
            completion_tokens: usage.completionTokens,
            total_tokens: usage.totalTokens,
            input_cost_in_dollars: inputCost,
            output_cost_in_dollars: outputCost,
            total_cost_in_dollars: totalCost,
            response_time_in_ms: responseTimeMs,
          },
        });
      } catch (error) {
        parseError(error);
      }
      streamingData.close();
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  // 10. Return streaming data
  return result.toDataStreamResponse({
    data: streamingData,
    // getErrorMessage: (error: unknown): string => {
    //   // Log the full error for debugging
    //   console.error('Full stream error:', error);

    //   if (error == null) {
    //     return 'unknown error';
    //   }

    //   // If it's an object with additional error details, log and return them
    //   if (typeof error === 'object' && error !== null) {
    //     const fullError = JSON.stringify(error, null, 2);
    //     console.error('Detailed error:', fullError);

    //     // If it has a message property, return that
    //     if ('message' in error && typeof error.message === 'string') {
    //       return error.message;
    //     }

    //     // Return the full error string for maximum debugging info
    //     return fullError;
    //   }

    //   if (typeof error === 'string') {
    //     return error;
    //   }

    //   if (error instanceof Error) {
    //     // Log the full error object including stack trace
    //     console.error('Error stack:', error.stack);
    //     return error.message;
    //   }

    //   return String(error);
    // },
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

    // Delete chat (cascade deletes messages due to FK)
    await deleteChatById({ chatId: id, userId: user.id });
    return new Response('Chat deleted', { status: 200 });
  } catch (_error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
