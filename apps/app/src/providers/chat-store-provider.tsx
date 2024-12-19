"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import type { ChatState, ChatStore } from "~/stores/chat-store";
import { createChatStore } from "~/stores/chat-store";

export type ChatStoreApi = ReturnType<typeof createChatStore>;

export const ChatStoreContext = createContext<ChatStoreApi | undefined>(
  undefined,
);

export interface ChatStoreProviderProps {
  children: ReactNode;
  initialState?: ChatState;
}

export function ChatStoreProvider({
  children,
  initialState,
}: ChatStoreProviderProps) {
  const storeRef = useRef<ChatStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createChatStore(initialState);
  }

  return (
    <ChatStoreContext.Provider value={storeRef.current}>
      {children}
    </ChatStoreContext.Provider>
  );
}

export function useChatStore<T>(selector: (store: ChatStore) => T): T {
  const store = useContext(ChatStoreContext);

  if (!store) {
    throw new Error("useChatStore must be used within a ChatStoreProvider");
  }

  return useStore(store, selector);
}
