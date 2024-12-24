import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { Message } from '@lamp/ai';
import { convertToCoreMessages, customModel, streamText } from '@lamp/ai';
import { DEFAULT_MODEL_NAME, models } from '@lamp/ai/models';

export async function POST(req: NextRequest) {
  const {
    messages,
    modelId = DEFAULT_MODEL_NAME,
    system,
  } = (await req.json()) as {
    messages: Message[];
    modelId?: string;
    system?: string;
  };

  const model = models.find((m) => m.id === modelId);

  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  const coreMessages = convertToCoreMessages(messages);

  try {
    const result = streamText({
      model: customModel(modelId),
      system: system,
      messages: coreMessages,
      maxTokens: 2048,
    });

    return result.toDataStreamResponse();
  } catch {
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
