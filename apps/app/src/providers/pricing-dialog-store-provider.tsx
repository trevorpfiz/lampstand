'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import type {
  PricingDialogState,
  PricingDialogStore,
} from '~/stores/pricing-dialog-store';
import { createPricingDialogStore } from '~/stores/pricing-dialog-store';

export type PricingDialogStoreApi = ReturnType<typeof createPricingDialogStore>;

export const PricingDialogStoreContext = createContext<
  PricingDialogStoreApi | undefined
>(undefined);

export interface PricingDialogStoreProviderProps {
  children: ReactNode;
  initialState?: PricingDialogState;
}

export const PricingDialogStoreProvider = ({
  children,
  initialState,
}: PricingDialogStoreProviderProps) => {
  const storeRef = useRef<PricingDialogStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createPricingDialogStore(initialState);
  }

  return (
    <PricingDialogStoreContext.Provider value={storeRef.current}>
      {children}
    </PricingDialogStoreContext.Provider>
  );
};

export function usePricingDialogStore<T>(
  selector: (store: PricingDialogStore) => T
): T {
  const store = useContext(PricingDialogStoreContext);

  if (!store) {
    throw new Error(
      'usePricingDialogStore must be used within a PricingDialogStoreProvider'
    );
  }

  return useStore(store, selector);
}
