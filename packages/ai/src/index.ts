import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import {
  experimental_createProviderRegistry as createProviderRegistry,
  experimental_wrapLanguageModel as wrapLanguageModel,
} from 'ai';

import { env } from '@lamp/env';

import { customMiddleware } from './lib/custom-middleware';

// Initialize providers
const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
  compatibility: 'strict',
});

const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});

// Create provider registry
const registry = createProviderRegistry({
  openai: openai,
  google: google,
});

export const customModel = (apiIdentifier: string) => {
  // Split provider and model ID
  const [provider, modelId] = apiIdentifier.includes(':')
    ? apiIdentifier.split(':')
    : ['openai', apiIdentifier]; // Default to OpenAI if no provider specified

  return wrapLanguageModel({
    model: registry.languageModel(`${provider}:${modelId}`),
    middleware: customMiddleware,
  });
};

export * from 'ai';
