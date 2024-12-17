import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { convertToCoreMessages, customModel, streamText } from "@lamp/ai";

export async function POST(req: NextRequest) {
  const { messages, model = "gpt-4o-mini", system } = await req.json();

  try {
    const result = await streamText({
      maxTokens: 2048,
      messages: convertToCoreMessages(messages),
      model: customModel(model),
      system: system,
    });

    return result.toDataStreamResponse();
  } catch {
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}
