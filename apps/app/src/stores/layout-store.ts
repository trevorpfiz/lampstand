import { createStore } from "zustand/vanilla";

export interface LayoutState {
  isHydrated: boolean;
  initialScrollDone: boolean;
  showScrollButton: boolean;
}

export interface LayoutActions {
  setHydrated: (hydrated: boolean) => void;
  setInitialScrollDone: (done: boolean) => void;
  setShowScrollButton: (show: boolean) => void;
}

export type LayoutStore = LayoutState & LayoutActions;

export const defaultLayoutState: LayoutState = {
  isHydrated: false,
  initialScrollDone: false,
  showScrollButton: false,
};

export const createLayoutStore = (
  initState: LayoutState = defaultLayoutState,
) => {
  return createStore<LayoutStore>((set) => ({
    ...initState,
    setHydrated: (hydrated: boolean) => set(() => ({ isHydrated: hydrated })),
    setInitialScrollDone: (done: boolean) =>
      set(() => ({ initialScrollDone: done })),
    setShowScrollButton: (show: boolean) =>
      set(() => ({ showScrollButton: show })),
  }));
};
