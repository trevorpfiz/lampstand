import { createStore } from 'zustand/vanilla';

export interface PricingDialogState {
  isOpen: boolean;
}

export interface PricingDialogActions {
  openPricingDialog: () => void;
  closePricingDialog: () => void;
}

export type PricingDialogStore = PricingDialogState & PricingDialogActions;

export const defaultPricingDialogState: PricingDialogState = {
  isOpen: false,
};

export const createPricingDialogStore = (
  initState: PricingDialogState = defaultPricingDialogState
) => {
  return createStore<PricingDialogStore>((set) => ({
    ...initState,
    openPricingDialog: () => set(() => ({ isOpen: true })),
    closePricingDialog: () => set(() => ({ isOpen: false })),
  }));
};
