'use client';

import { type RefObject, useCallback, useEffect, useState } from 'react';

import { useDebounce } from '~/hooks/use-debounce';
import { useBibleStore } from '~/providers/bible-store-provider';
import { useLayoutStore } from '~/providers/layout-store-provider';
import { type ReferenceData, parseReferenceId } from '~/utils/bible/reference';

interface UseVerseTrackingProps {
  containerRef: RefObject<HTMLDivElement | null>;
  shouldUpdateStore?: boolean;
}

export function useVerseTracking({
  containerRef,
  shouldUpdateStore = true,
}: UseVerseTrackingProps) {
  const setCurrentReference = useBibleStore(
    (state) => state.setCurrentReference
  );
  const isHydrated = useLayoutStore((state) => state.isHydrated);

  const [lastVisibleReference, setLastVisibleReference] =
    useState<ReferenceData | null>(null);
  const debouncedReference = useDebounce(lastVisibleReference, 200);

  /**
   * Whenever we have a new debounced reference and the layout is ready,
   * update the currentReference in the store.
   */
  useEffect(() => {
    if (debouncedReference && isHydrated && shouldUpdateStore) {
      setCurrentReference(debouncedReference);
    }
  }, [debouncedReference, setCurrentReference, isHydrated, shouldUpdateStore]);

  /**
   * Called on scroll (or mount) to figure out which verse is at the top.
   * We'll parse the "data-reference" attribute (e.g. "GEN-1-1") into { book: "GEN", chapter:1, verse:1 }
   */
  const updateCurrentReference = useCallback(() => {
    const container = containerRef.current;
    if (!container || !isHydrated) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const verseElements = container.querySelectorAll('[data-reference]');
    let topVerse: HTMLElement | null = null;

    // Find the first verse whose top is >= container’s top
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

    // e.g. "GEN-1-1"
    const referenceId = topVerse.getAttribute('data-reference');
    if (!referenceId) {
      return;
    }

    // Let the parse function do the heavy lifting
    const newRef = parseReferenceId(referenceId);
    if (!newRef) {
      return;
    }

    // Only update if it actually changed
    if (JSON.stringify(lastVisibleReference) !== JSON.stringify(newRef)) {
      setLastVisibleReference(newRef);
    }
  }, [containerRef, isHydrated, lastVisibleReference]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => {
      updateCurrentReference();
    };

    // Initialize once on mount
    updateCurrentReference();

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, updateCurrentReference]);
}
