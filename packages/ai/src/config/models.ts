// @link https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json

export interface Model {
  id: 'openai:gpt-4o-mini' | 'openai:gpt-4o' | 'google:gemini-2.0-flash-exp';
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
  supportsAudioOutput?: boolean;
  maxImagesPerPrompt?: number;
  maxVideosPerPrompt?: number;
  maxVideoLength?: number;
  maxAudioLengthHours?: number;
  maxAudioPerPrompt?: number;
  maxPdfSizeMb?: number;
}

export const models: Model[] = [
  {
    id: 'openai:gpt-4o-mini',
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
    id: 'openai:gpt-4o',
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
  {
    id: 'google:gemini-2.0-flash-exp',
    label: 'Gemini 2.0 Flash',
    apiIdentifier: 'gemini-2.0-flash-exp',
    description: 'Fast, efficient model with multimodal capabilities',
    premium: false,
    maxTokens: 8192,
    maxInputTokens: 1048576,
    maxOutputTokens: 8192,
    inputCostPerToken: 0,
    outputCostPerToken: 0,
    inputCostPerTokenBatches: 0,
    outputCostPerTokenBatches: 0,
    cacheReadInputTokenCost: 0,
    litellmProvider: 'vertex_ai-language-models',
    mode: 'chat',
    supportsFunctionCalling: true,
    supportsParallelFunctionCalling: false,
    supportsResponseSchema: true,
    supportsVision: true,
    supportsPromptCaching: false,
    supportsSystemMessages: true,
    supportsAudioOutput: true,
    maxImagesPerPrompt: 3000,
    maxVideosPerPrompt: 10,
    maxVideoLength: 1,
    maxAudioLengthHours: 8.4,
    maxAudioPerPrompt: 1,
    maxPdfSizeMb: 30,
  },
] as const;

export const DEFAULT_MODEL_NAME = 'google:gemini-2.0-flash-exp';
export const DEFAULT_NAMING_MODEL = 'google:gemini-2.0-flash-exp';
export const FREE_USAGE_LIMIT = 15;
export const PREMIUM_USAGE_LIMIT = 5;
