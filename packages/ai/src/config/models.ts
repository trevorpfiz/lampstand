// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
  plan: "free" | "pro";
}

export const models: Model[] = [
  {
    id: "gpt-4o-mini",
    label: "GPT-4o mini",
    apiIdentifier: "gpt-4o-mini",
    description: "Small model for fast, lightweight tasks",
    plan: "free",
  },
  {
    id: "gpt-4o",
    label: "GPT-4o",
    apiIdentifier: "gpt-4o",
    description: "For complex, multi-step tasks",
    plan: "pro",
  },
] as const;

export const DEFAULT_MODEL_NAME = "gpt-4o-mini";
