'use client';

import { type RefObject, useCallback, useEffect, useState } from 'react';

import { useDebounce } from '~/hooks/use-debounce';
import { useBibleStore } from '~/providers/bible-store-provider';
import { useLayoutStore } from '~/providers/layout-store-provider';
import type { VerseReference } from '~/utils/bible/verse';

interface UseVerseTrackingProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

export function useVerseTracking({ containerRef }: UseVerseTrackingProps) {
  const setCurrentVerse = useBibleStore((state) => state.setCurrentVerse);
  const isHydrated = useLayoutStore((state) => state.isHydrated);
  const initialScrollDone = useLayoutStore((state) => state.initialScrollDone);

  const [lastVisibleVerse, setLastVisibleVerse] =
    useState<VerseReference | null>(null);
  const debouncedVerse = useDebounce(lastVisibleVerse, 200);

  useEffect(() => {
    if (debouncedVerse && isHydrated && initialScrollDone) {
      setCurrentVerse(debouncedVerse);
    }
  }, [debouncedVerse, setCurrentVerse, isHydrated, initialScrollDone]);

  const updateCurrentVerse = useCallback(() => {
    const container = containerRef.current;
    if (!container || !isHydrated || !initialScrollDone) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const verseElements = container.querySelectorAll('[data-verse-id]');
    let topVerse: HTMLElement | null = null;

    for (const el of verseElements) {
      const rect = el.getBoundingClientRect();
      if (rect.top >= containerRect.top) {
        topVerse = el as HTMLElement;
        break;
      }
    }

    if (!topVerse) {
      return;
    }

    const verseId = topVerse.getAttribute('data-verse-id');
    if (!verseId) {
      return;
    }

    const [book, chapter, verse] = verseId.split('-');
    if (!book || !chapter) {
      return;
    }

    const capitalizedBook = book
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const newVerse: VerseReference = {
      book: capitalizedBook,
      chapter: Number.parseInt(chapter, 10),
      verse: verse ? Number.parseInt(verse, 10) : undefined,
    };

    if (JSON.stringify(lastVisibleVerse) !== JSON.stringify(newVerse)) {
      setLastVisibleVerse(newVerse);
    }
  }, [containerRef, isHydrated, initialScrollDone, lastVisibleVerse]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => {
      updateCurrentVerse();
    };

    // Run once on mount to initialize
    updateCurrentVerse();

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, updateCurrentVerse]);
}
