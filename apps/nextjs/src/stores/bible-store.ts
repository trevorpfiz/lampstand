import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import type { VerseReference } from "~/utils/bible/verse";

export type BibleVersion = "BSB" | "KJV";

export interface BibleState {
  currentVerse: VerseReference;
  lastScrollPosition: number;
  isHydrated?: boolean;
  bibleVersion: BibleVersion;
}

export interface BibleActions {
  setCurrentVerse: (verse: VerseReference) => void;
  setLastScrollPosition: (position: number) => void;
  setHydrated: (hydrated: boolean) => void;
  setBibleVersion: (version: BibleVersion) => void;
}

export type BibleStore = BibleState & BibleActions;

const defaultBibleState: BibleState = {
  currentVerse: { book: "Genesis", chapter: 1, verse: 1 },
  lastScrollPosition: 0,
  isHydrated: false,
  bibleVersion: "BSB",
};

export const createBibleStore = (initState: BibleState = defaultBibleState) => {
  return createStore<BibleStore>()(
    persist(
      (set) => ({
        ...initState,
        setCurrentVerse: (verse) =>
          set((state) => {
            if (
              !state.isHydrated ||
              (state.currentVerse.book === verse.book &&
                state.currentVerse.chapter === verse.chapter &&
                state.currentVerse.verse === verse.verse)
            ) {
              return state;
            }
            return { currentVerse: verse };
          }),
        setLastScrollPosition: (position) =>
          set(() => ({ lastScrollPosition: position })),
        setHydrated: (hydrated) => set({ isHydrated: hydrated }),
        setBibleVersion: (version) => set(() => ({ bibleVersion: version })),
      }),
      {
        name: "bible-store",
      },
    ),
  );
};
