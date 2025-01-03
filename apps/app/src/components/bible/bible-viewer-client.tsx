'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { VerseNavigationBar } from '~/components/bible/verse-navigation-bar';
import { useVerseTracking } from '~/hooks/use-verse-tracking';
import { useBibleStore } from '~/providers/bible-store-provider';
import { useLayoutStore } from '~/providers/layout-store-provider';
import type { IRChapter } from '~/types/bible';
import { renderChapter } from '~/utils/bible/formatting-assembly';
import {
  type ReferenceData,
  formatReference,
  formatReferenceForCopy,
  makeReferenceId,
  parseReferenceId,
} from '~/utils/bible/reference';

interface BibleViewerClientProps {
  chapters: IRChapter[];
}

function BibleViewerClient({ chapters }: BibleViewerClientProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const currentReference = useBibleStore((state) => state.currentReference);

  const isHydrated = useLayoutStore((state) => state.isHydrated);
  const initialScrollDone = useLayoutStore((state) => state.initialScrollDone);
  const setInitialScrollDone = useLayoutStore(
    (state) => state.setInitialScrollDone
  );

  const virtualizer = useVirtualizer({
    count: chapters.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 1800,
    overscan: 1,
    enabled: true,
  });

  useVerseTracking({ containerRef: parentRef });

  /**
   * Scroll to a given reference.
   * Steps:
   *  1) Find the chapter index by matching (ch.bookName & ch.number) to ref.book & ref.chapter
   *  2) virtualizer.scrollToIndex(chapterIndex)
   *  3) after load, if ref.verse => querySelector(`[data-reference="${makeReferenceId(ref)}"]`) and scroll smoothly
   */
  const scrollToReference = useCallback(
    (ref: ReferenceData, initial?: boolean) => {
      console.log('scrollToReference', ref, initial);
      // We must have a chapter to do anything. If no chapter, maybe scroll to the first?
      if (!ref.chapter) {
        // If no chapter, maybe we do nothing or just scroll to index 0.
        if (initial) {
          setInitialScrollDone(true);
        }
        return;
      }

      // find the chapter index by comparing book codes directly
      const chapterIndex = chapters.findIndex((ch) => {
        const matches = ch.bookName === ref.book && ch.number === ref.chapter;
        return matches;
      });
      if (chapterIndex < 0) {
        // Not found
        if (initial) {
          setInitialScrollDone(true);
        }
        return;
      }

      // First, ensure the virtualizer loads that chapter at the top:
      virtualizer.scrollToIndex(chapterIndex, { align: 'start' });

      // Then, if there's a verse, scroll inside the chapter
      setTimeout(() => {
        if (ref.verse && parentRef.current) {
          const refId = makeReferenceId(ref); // e.g. "GEN-1-1"
          const el = parentRef.current.querySelector(
            `[data-reference="${refId}"]`
          );
          if (el instanceof HTMLElement) {
            const parentRect = parentRef.current.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            const offset =
              elRect.top - parentRect.top + parentRef.current.scrollTop;
            parentRef.current.scrollTo({ top: offset, behavior: 'smooth' });
          }
        }
      }, 200);

      if (initial) {
        setInitialScrollDone(true);
      }
    },
    [chapters, setInitialScrollDone, virtualizer]
  );

  // Perform initial scroll after hydration and only if not done already
  useLayoutEffect(() => {
    if (initialScrollDone || !isHydrated) {
      return;
    }
    requestAnimationFrame(() => {
      scrollToReference(currentReference, true);
    });
  }, [currentReference, initialScrollDone, isHydrated, scrollToReference]);

  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        return;
      }

      const range = selection.getRangeAt(0);

      const verseEls = Array.from(
        parentRef.current?.querySelectorAll('[data-ref-type="verse"]') ?? []
      );

      const selectedVerseEls = verseEls.filter((el) =>
        range.intersectsNode(el)
      );
      if (selectedVerseEls.length === 0) {
        return;
      }

      e.preventDefault();

      // Single verse case
      if (selectedVerseEls.length === 1) {
        const verseEl = selectedVerseEls[0];
        const isPartial =
          range.startContainer !== verseEl && range.endContainer !== verseEl;

        if (isPartial) {
          const partialFragment = range.cloneContents();
          for (const fn of Array.from(
            partialFragment.querySelectorAll('sup')
          )) {
            fn.remove();
          }

          const partialText = partialFragment.textContent?.trim() ?? '';
          const verseEl = selectedVerseEls[0];
          if (!verseEl) {
            return;
          }

          const refId = verseEl.getAttribute('data-reference') ?? '';
          const ref = parseReferenceId(refId);
          if (!ref) {
            return;
          }

          const finalText = `${partialText}\n— ${formatReference(ref)}`;
          e.clipboardData?.setData('text/plain', finalText);
          return;
        }

        const verseClone = verseEl.cloneNode(true) as HTMLElement;
        for (const fn of Array.from(verseClone.querySelectorAll('sup'))) {
          fn.remove();
        }

        const verseText = verseClone.textContent?.trim() ?? '';
        const refId = verseEl.getAttribute('data-reference') ?? '';
        const ref = parseReferenceId(refId);
        if (!ref) {
          return;
        }

        const finalText = `${verseText}\n— ${formatReference(ref)}`;
        e.clipboardData?.setData('text/plain', finalText);
        return;
      }

      // Multiple verses or partial selection across verses
      const selectedRangeFragment = range.cloneContents();
      for (const fn of Array.from(
        selectedRangeFragment.querySelectorAll('sup')
      )) {
        fn.remove();
      }

      const fragmentVerseEls = Array.from(
        selectedRangeFragment.querySelectorAll('[data-ref-type="verse"]')
      );

      if (fragmentVerseEls.length === 0) {
        const rawSelectedText = selection.toString().trim();
        e.clipboardData?.setData('text/plain', rawSelectedText);
        return;
      }

      // Get first and last verse references
      const firstVerseEl = selectedVerseEls[0];
      const lastVerseEl = selectedVerseEls.at(-1);

      const firstRefId = firstVerseEl?.getAttribute('data-reference');
      const lastRefId = lastVerseEl?.getAttribute('data-reference');

      if (!firstRefId || !lastRefId) {
        return;
      }

      const firstRef = parseReferenceId(firstRefId);
      const lastRef = parseReferenceId(lastRefId);

      if (!firstRef || !lastRef) {
        return;
      }

      const verseTexts: string[] = [];
      for (const vEl of fragmentVerseEls) {
        const verseText = vEl.textContent?.trim() ?? '';
        if (verseText) {
          verseTexts.push(verseText);
        }
      }

      if (verseTexts.length === 0) {
        verseTexts.push('');
      }

      const combinedText = verseTexts.join(' ');
      const finalText = `${combinedText}\n— ${formatReferenceForCopy(firstRef, lastRef)}`;

      e.clipboardData?.setData('text/plain', finalText);
    };

    const container = parentRef.current;
    container?.addEventListener('copy', handleCopy);
    return () => {
      container?.removeEventListener('copy', handleCopy);
    };
  }, []);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="flex h-full flex-col">
      <VerseNavigationBar scrollToReference={scrollToReference} />
      <div
        ref={parentRef}
        className="default-scrollbar flex-1 overflow-auto px-3 pb-28"
        style={{ contain: 'strict' }}
      >
        <div
          style={{
            position: 'relative',
            height: virtualizer.getTotalSize(),
            width: '100%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
            }}
          >
            {virtualItems.map((virtualRow) => {
              const chapter = chapters[virtualRow.index];
              if (!chapter) {
                return null;
              }

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className="p-2"
                >
                  {renderChapter(chapter)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export { BibleViewerClient };
