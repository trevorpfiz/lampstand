import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export interface PanelsState {
  isChatOpen: boolean;
  isNotesOpen: boolean;
}

export interface PanelsActions {
  toggleChat: () => void;
  toggleNotes: () => void;
  setChat: (isOpen: boolean) => void;
  setNotes: (isOpen: boolean) => void;
}

export type PanelsStore = PanelsState & PanelsActions;

export const defaultPanelsState: PanelsState = {
  isChatOpen: false,
  isNotesOpen: false,
};

export const createPanelsStore = (
  initState: PanelsState = defaultPanelsState,
) => {
  return createStore<PanelsStore>()(
    persist(
      (set) => ({
        ...initState,
        toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
        toggleNotes: () =>
          set((state) => ({ isNotesOpen: !state.isNotesOpen })),
        setChat: (isOpen: boolean) => set({ isChatOpen: isOpen }),
        setNotes: (isOpen: boolean) => set({ isNotesOpen: isOpen }),
      }),
      {
        name: "panels-store",
      },
    ),
  );
};
