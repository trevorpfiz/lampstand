// @link https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json

export interface Model {
  id: 'gpt-4o-mini' | 'gpt-4o';
  label: string;
  apiIdentifier: string;
  description: string;
  premium: boolean;
  maxTokens: number;
  maxInputTokens: number;
  maxOutputTokens: number;
  inputCostPerToken: number;
  outputCostPerToken: number;
  inputCostPerTokenBatches: number;
  outputCostPerTokenBatches: number;
  cacheReadInputTokenCost: number;
  litellmProvider: string;
  mode: string;
  supportsFunctionCalling: boolean;
  supportsParallelFunctionCalling: boolean;
  supportsResponseSchema: boolean;
  supportsVision: boolean;
  supportsPromptCaching: boolean;
  supportsSystemMessages: boolean;
}

export const models: Model[] = [
  {
    id: 'gpt-4o-mini',
    label: 'GPT-4o mini',
    apiIdentifier: 'gpt-4o-mini',
    description: 'Small model for fast, lightweight tasks',
    premium: false,
    maxTokens: 16384,
    maxInputTokens: 128000,
    maxOutputTokens: 16384,
    inputCostPerToken: 0.00000015,
    outputCostPerToken: 0.0000006,
    inputCostPerTokenBatches: 0.000000075,
    outputCostPerTokenBatches: 0.0000003,
    cacheReadInputTokenCost: 0.000000075,
    litellmProvider: 'openai',
    mode: 'chat',
    supportsFunctionCalling: true,
    supportsParallelFunctionCalling: true,
    supportsResponseSchema: true,
    supportsVision: true,
    supportsPromptCaching: true,
    supportsSystemMessages: true,
  },
  {
    id: 'gpt-4o',
    label: 'GPT-4o',
    apiIdentifier: 'gpt-4o',
    description: 'For complex, multi-step tasks',
    premium: true,
    maxTokens: 16384,
    maxInputTokens: 128000,
    maxOutputTokens: 16384,
    inputCostPerToken: 0.0000025,
    outputCostPerToken: 0.00001,
    inputCostPerTokenBatches: 0.00000125,
    outputCostPerTokenBatches: 0.000005,
    cacheReadInputTokenCost: 0.00000125,
    litellmProvider: 'openai',
    mode: 'chat',
    supportsFunctionCalling: true,
    supportsParallelFunctionCalling: true,
    supportsResponseSchema: true,
    supportsVision: true,
    supportsPromptCaching: true,
    supportsSystemMessages: true,
  },
] as const;

export const DEFAULT_MODEL_NAME = 'gpt-4o-mini';
export const FREE_USAGE_LIMIT = 15;
export const PREMIUM_USAGE_LIMIT = 5;
