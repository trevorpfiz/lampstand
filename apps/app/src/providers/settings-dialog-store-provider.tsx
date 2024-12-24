'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import type {
  SettingsDialogState,
  SettingsDialogStore,
} from '~/stores/settings-dialog-store';
import { createSettingsDialogStore } from '~/stores/settings-dialog-store';

export type SettingsDialogStoreApi = ReturnType<
  typeof createSettingsDialogStore
>;

export const SettingsDialogStoreContext = createContext<
  SettingsDialogStoreApi | undefined
>(undefined);

export interface SettingsDialogStoreProviderProps {
  children: ReactNode;
  initialState?: SettingsDialogState;
}

export const SettingsDialogStoreProvider = ({
  children,
  initialState,
}: SettingsDialogStoreProviderProps) => {
  const storeRef = useRef<SettingsDialogStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createSettingsDialogStore(initialState);
  }

  return (
    <SettingsDialogStoreContext.Provider value={storeRef.current}>
      {children}
    </SettingsDialogStoreContext.Provider>
  );
};

export function useSettingsDialogStore<T>(
  selector: (store: SettingsDialogStore) => T
): T {
  const store = useContext(SettingsDialogStoreContext);

  if (!store) {
    throw new Error(
      'useSettingsDialogStore must be used within a SettingsDialogStoreProvider'
    );
  }

  return useStore(store, selector);
}
