"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef } from "react";
import { useStore } from "zustand";

import type { LayoutState, LayoutStore } from "~/stores/layout-store";
import { createLayoutStore } from "~/stores/layout-store";

export type LayoutStoreApi = ReturnType<typeof createLayoutStore>;

export const LayoutStoreContext = createContext<LayoutStoreApi | undefined>(
  undefined,
);

export interface LayoutStoreProviderProps {
  children: ReactNode;
  initialState?: LayoutState;
}

export function LayoutStoreProvider({
  children,
  initialState,
}: LayoutStoreProviderProps) {
  const storeRef = useRef<LayoutStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createLayoutStore(initialState);
  }

  useEffect(() => {
    storeRef.current?.setState({ isHydrated: true });
    console.log("BibleStoreProvider: Hydrated");
  }, []);

  return (
    <LayoutStoreContext.Provider value={storeRef.current}>
      {children}
    </LayoutStoreContext.Provider>
  );
}

export function useLayoutStore<T>(selector: (store: LayoutStore) => T): T {
  const store = useContext(LayoutStoreContext);

  if (!store) {
    throw new Error("useLayoutStore must be used within a LayoutStoreProvider");
  }

  return useStore(store, selector);
}
