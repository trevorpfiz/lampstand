import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import type { VerseReference } from "~/utils/bible/verse";

export type BibleVersion = "BSB" | "KJV";

export interface BibleState {
  currentVerse: VerseReference;
  bibleVersion: BibleVersion;
}

export interface BibleActions {
  setCurrentVerse: (verse: VerseReference) => void;
  setBibleVersion: (version: BibleVersion) => void;
}

export type BibleStore = BibleState & BibleActions;

const defaultBibleState: BibleState = {
  currentVerse: { book: "Genesis", chapter: 1, verse: 1 },
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
              state.currentVerse.book === verse.book &&
              state.currentVerse.chapter === verse.chapter &&
              state.currentVerse.verse === verse.verse
            ) {
              return state;
            }
            return { currentVerse: verse };
          }),
        setBibleVersion: (version) => set(() => ({ bibleVersion: version })),
      }),
      {
        name: "bible-store",
      },
    ),
  );
};
