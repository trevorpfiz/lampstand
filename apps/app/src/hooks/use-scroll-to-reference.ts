import type { Virtualizer } from '@tanstack/react-virtual';
import type { RefObject } from 'react';
import { useCallback } from 'react';
import type { SlimChapter } from '~/types/bible';
import type { ReferenceData } from '~/utils/bible/reference';
import { makeReferenceId } from '~/utils/bible/reference';

interface UseScrollToReferenceProps {
  chapters: SlimChapter[];
  virtualizer?: Virtualizer<HTMLDivElement, Element> | null;
  containerRef: RefObject<HTMLDivElement | null> | null;
}

export function useScrollToReference({
  chapters,
  virtualizer,
  containerRef,
}: UseScrollToReferenceProps) {
  const scrollToReference = useCallback(
    (ref: ReferenceData) => {
      // We must have a chapter to do anything. If no chapter, maybe scroll to the first?
      if (!ref.chapter) {
        return;
      }

      // find the chapter index by comparing book codes directly
      const chapterIndex = chapters.findIndex((ch) => {
        const matches = ch.bookName === ref.book && ch.number === ref.chapter;
        return matches;
      });
      if (chapterIndex < 0) {
        return;
      }

      // If we have a virtualizer, use it to scroll to the chapter
      if (virtualizer) {
        virtualizer.scrollToIndex(chapterIndex, { align: 'start' });
      }

      // Then, if there's a verse, scroll inside the chapter
      setTimeout(() => {
        if (!containerRef || !containerRef.current || !ref.verse) {
          return;
        }

        const refId = makeReferenceId(ref); // e.g. "GEN-1-1"
        const el = containerRef.current.querySelector(
          `[data-reference="${refId}"]`
        );
        if (el instanceof HTMLElement) {
          const parentRect = containerRef.current.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const offset =
            elRect.top - parentRect.top + containerRef.current.scrollTop;
          containerRef.current.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }, 200);
    },
    [chapters, virtualizer, containerRef]
  );

  return scrollToReference;
}
