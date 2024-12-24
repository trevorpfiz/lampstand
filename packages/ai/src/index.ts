import { createOpenAI } from '@ai-sdk/openai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { env } from '@lamp/env';

import { customMiddleware } from './lib/custom-middleware';

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
  compatibility: 'strict', // strict mode, enable when using the OpenAI API
});

export const customModel = (apiIdentifier: string) => {
  return wrapLanguageModel({
    model: openai(apiIdentifier),
    middleware: customMiddleware,
  });
};

export * from 'ai';
