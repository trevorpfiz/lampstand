import { createStore } from "zustand/vanilla";

export interface LayoutState {
  isHydrated: boolean;
  initialScrollDone: boolean;
}

export interface LayoutActions {
  setHydrated: (hydrated: boolean) => void;
  setInitialScrollDone: (done: boolean) => void;
}

export type LayoutStore = LayoutState & LayoutActions;

export const defaultLayoutState: LayoutState = {
  isHydrated: false,
  initialScrollDone: false,
};

export const createLayoutStore = (
  initState: LayoutState = defaultLayoutState,
) => {
  return createStore<LayoutStore>((set) => ({
    ...initState,
    setHydrated: (hydrated: boolean) => set(() => ({ isHydrated: hydrated })),
    setInitialScrollDone: (done: boolean) =>
      set(() => ({ initialScrollDone: done })),
  }));
};
