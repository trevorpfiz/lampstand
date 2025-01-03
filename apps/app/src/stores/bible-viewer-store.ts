import type { Virtualizer } from '@tanstack/react-virtual';
import type { RefObject } from 'react';
import { createStore } from 'zustand/vanilla';
import type { SlimChapter } from '~/types/bible';

export interface BibleViewerState {
  virtualizer: Virtualizer<HTMLDivElement, Element> | null;
  containerRef: RefObject<HTMLDivElement | null> | null;
  chapters: SlimChapter[];
}

export interface BibleViewerActions {
  setVirtualizer: (virtualizer: Virtualizer<HTMLDivElement, Element>) => void;
  setContainerRef: (ref: RefObject<HTMLDivElement | null>) => void;
  setChapters: (chapters: SlimChapter[]) => void;
}

export type BibleViewerStore = BibleViewerState & BibleViewerActions;

export const defaultBibleViewerState: BibleViewerState = {
  virtualizer: null,
  containerRef: null,
  chapters: [],
};

export const createBibleViewerStore = (
  initState: BibleViewerState = defaultBibleViewerState
) => {
  return createStore<BibleViewerStore>((set) => ({
    ...initState,
    setVirtualizer: (virtualizer) => set(() => ({ virtualizer })),
    setContainerRef: (ref) => set(() => ({ containerRef: ref })),
    setChapters: (chapters) => set(() => ({ chapters })),
  }));
};
