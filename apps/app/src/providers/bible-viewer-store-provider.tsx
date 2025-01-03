'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import type {
  BibleViewerState,
  BibleViewerStore,
} from '~/stores/bible-viewer-store';
import { createBibleViewerStore } from '~/stores/bible-viewer-store';

export type BibleViewerStoreApi = ReturnType<typeof createBibleViewerStore>;

export const BibleViewerStoreContext = createContext<
  BibleViewerStoreApi | undefined
>(undefined);

export interface BibleViewerStoreProviderProps {
  children: ReactNode;
  initialState?: BibleViewerState;
}

export function BibleViewerStoreProvider({
  children,
  initialState,
}: BibleViewerStoreProviderProps) {
  const storeRef = useRef<BibleViewerStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createBibleViewerStore(initialState);
  }

  return (
    <BibleViewerStoreContext.Provider value={storeRef.current}>
      {children}
    </BibleViewerStoreContext.Provider>
  );
}

export function useBibleViewerStore<T>(
  selector: (store: BibleViewerStore) => T
): T {
  const store = useContext(BibleViewerStoreContext);

  if (!store) {
    throw new Error(
      'useBibleViewerStore must be used within a BibleViewerStoreProvider'
    );
  }

  return useStore(store, selector);
}
