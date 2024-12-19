import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import type { Model } from "@lamp/ai/models";
import { DEFAULT_MODEL_NAME } from "@lamp/ai/models";

export interface ChatState {
  modelId: string;
}

export interface ChatActions {
  setModelId: (modelId: string) => void;
}

export type ChatStore = ChatState & ChatActions;

const defaultChatState: ChatState = {
  modelId: DEFAULT_MODEL_NAME,
};

export const createChatStore = (initState: ChatState = defaultChatState) => {
  return createStore<ChatStore>()(
    persist(
      (set) => ({
        ...initState,
        setModelId: (modelId) =>
          set((state) => {
            if (state.modelId === modelId) {
              return state;
            }
            return { modelId };
          }),
      }),
      {
        name: "chat-store",
      },
    ),
  );
};
