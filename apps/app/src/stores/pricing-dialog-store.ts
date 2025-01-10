import { createStore } from 'zustand/vanilla';

export interface PricingDialogState {
  isOpen: boolean;
  isUpgradeOpen: boolean;
}

export interface PricingDialogActions {
  openPricingDialog: () => void;
  closePricingDialog: () => void;
  openUpgradeDialog: () => void;
  closeUpgradeDialog: () => void;
}

export type PricingDialogStore = PricingDialogState & PricingDialogActions;

export const defaultPricingDialogState: PricingDialogState = {
  isOpen: false,
  isUpgradeOpen: false,
};

export const createPricingDialogStore = (
  initState: PricingDialogState = defaultPricingDialogState
) => {
  return createStore<PricingDialogStore>((set) => ({
    ...initState,
    openPricingDialog: () => set(() => ({ isOpen: true })),
    closePricingDialog: () => set(() => ({ isOpen: false })),
    openUpgradeDialog: () => set(() => ({ isUpgradeOpen: true })),
    closeUpgradeDialog: () => set(() => ({ isUpgradeOpen: false })),
  }));
};
