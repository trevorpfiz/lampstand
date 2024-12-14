"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import type { BibleState, BibleStore } from "~/stores/bible-store";
import { createBibleStore } from "~/stores/bible-store";

export type BibleStoreApi = ReturnType<typeof createBibleStore>;

export const BibleStoreContext = createContext<BibleStoreApi | undefined>(
  undefined,
);

export interface BibleStoreProviderProps {
  children: ReactNode;
  initialState?: BibleState;
}

export function BibleStoreProvider({
  children,
  initialState,
}: BibleStoreProviderProps) {
  const storeRef = useRef<BibleStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createBibleStore(initialState);
  }

  return (
    <BibleStoreContext.Provider value={storeRef.current}>
      {children}
    </BibleStoreContext.Provider>
  );
}

export function useBibleStore<T>(selector: (store: BibleStore) => T): T {
  const store = useContext(BibleStoreContext);

  if (!store) {
    throw new Error("useBibleStore must be used within a BibleStoreProvider");
  }

  return useStore(store, selector);
}
