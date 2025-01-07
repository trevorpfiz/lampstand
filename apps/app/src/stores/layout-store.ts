import { createStore } from 'zustand/vanilla';

export interface LayoutState {
  isHydrated: boolean;
  showScrollButton: boolean;
}

export interface LayoutActions {
  setHydrated: (hydrated: boolean) => void;
  setShowScrollButton: (show: boolean) => void;
}

export type LayoutStore = LayoutState & LayoutActions;

export const defaultLayoutState: LayoutState = {
  isHydrated: false,
  showScrollButton: false,
};

export const createLayoutStore = (
  initState: LayoutState = defaultLayoutState
) => {
  return createStore<LayoutStore>((set) => ({
    ...initState,
    setHydrated: (hydrated: boolean) => set(() => ({ isHydrated: hydrated })),
    setShowScrollButton: (show: boolean) =>
      set(() => ({ showScrollButton: show })),
  }));
};
