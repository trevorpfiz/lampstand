"use client";

import { useCallback, useEffect, useRef } from "react";

import type { VerseReference } from "~/utils/bible/verse";
import { useDebounce } from "~/hooks/use-debounce";
import { useBibleStore } from "~/providers/bible-store-provider";

interface UseVerseTrackingProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useVerseTracking({ containerRef }: UseVerseTrackingProps) {
  const setCurrentVerse = useBibleStore((state) => state.setCurrentVerse);
  const lastVisibleVerseRef = useRef<VerseReference | null>(null);

  // Debounce so that it doesn't update too frequently while scrolling
  const debouncedVerse = useDebounce(lastVisibleVerseRef.current, 500);

  useEffect(() => {
    if (debouncedVerse) {
      setCurrentVerse(debouncedVerse);
    }
  }, [debouncedVerse, setCurrentVerse]);

  const updateCurrentVerse = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const verseElements = container.querySelectorAll("[data-verse-id]");
    let topVerse: HTMLElement | null = null;

    // Find the first verse whose top is below or right at the container's top edge
    for (const el of verseElements) {
      const rect = el.getBoundingClientRect();
      if (rect.top >= containerRect.top) {
        topVerse = el as HTMLElement;
        break;
      }
    }

    if (!topVerse) return;

    const verseId = topVerse.getAttribute("data-verse-id");
    if (!verseId) return;

    const [book, chapter, verse] = verseId.split("-");
    const newVerse: VerseReference = {
      book: book.charAt(0) + book.slice(1).toLowerCase(),
      chapter: parseInt(chapter, 10),
      verse: verse ? parseInt(verse, 10) : undefined,
    };

    // Only set if different from the last one
    if (
      JSON.stringify(lastVisibleVerseRef.current) !== JSON.stringify(newVerse)
    ) {
      lastVisibleVerseRef.current = newVerse;
    }
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      updateCurrentVerse();
    };

    // Run once on mount to initialize current verse
    updateCurrentVerse();

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [containerRef, updateCurrentVerse]);
}
