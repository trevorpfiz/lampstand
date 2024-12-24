'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import type { PanelsState, PanelsStore } from '~/stores/panels-store';
import { createPanelsStore } from '~/stores/panels-store';

export type PanelsStoreApi = ReturnType<typeof createPanelsStore>;

export const PanelsStoreContext = createContext<PanelsStoreApi | undefined>(
  undefined
);

export interface PanelsStoreProviderProps {
  children: ReactNode;
  initialState?: PanelsState;
}

export function PanelsStoreProvider({
  children,
  initialState,
}: PanelsStoreProviderProps) {
  const storeRef = useRef<PanelsStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createPanelsStore(initialState);
  }

  return (
    <PanelsStoreContext.Provider value={storeRef.current}>
      {children}
    </PanelsStoreContext.Provider>
  );
}

export function usePanelsStore<T>(selector: (store: PanelsStore) => T): T {
  const store = useContext(PanelsStoreContext);

  if (!store) {
    throw new Error('usePanelsStore must be used within a PanelsStoreProvider');
  }

  return useStore(store, selector);
}
