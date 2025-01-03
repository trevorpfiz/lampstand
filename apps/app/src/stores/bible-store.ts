import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import type { ReferenceData } from '~/utils/bible/reference';

export type BibleVersion = 'BSB' | 'KJV';

export interface BibleState {
  currentReference: ReferenceData;
  bibleVersion: BibleVersion;
}

export interface BibleActions {
  setCurrentReference: (reference: ReferenceData) => void;
  setBibleVersion: (version: BibleVersion) => void;
}

export type BibleStore = BibleState & BibleActions;

const defaultBibleState: BibleState = {
  currentReference: { book: 'GEN', chapter: 1 },
  bibleVersion: 'BSB',
};

export const createBibleStore = (initState: BibleState = defaultBibleState) => {
  return createStore<BibleStore>()(
    persist(
      (set) => ({
        ...initState,
        setCurrentReference: (reference) =>
          set(() => ({ currentReference: reference })),
        setBibleVersion: (version) => set(() => ({ bibleVersion: version })),
      }),
      {
        name: 'bible-store',
      }
    )
  );
};
