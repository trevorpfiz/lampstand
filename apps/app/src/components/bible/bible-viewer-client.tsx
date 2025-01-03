'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useLayoutEffect, useRef } from 'react';

import { VerseNavigationBar } from '~/components/bible/verse-navigation-bar';
import { useScrollToReference } from '~/hooks/use-scroll-to-reference';
import { useVerseTracking } from '~/hooks/use-verse-tracking';
import { useBibleStore } from '~/providers/bible-store-provider';
import { useBibleViewerStore } from '~/providers/bible-viewer-store-provider';
import { useLayoutStore } from '~/providers/layout-store-provider';
import type { IRChapter } from '~/types/bible';
import { renderChapter } from '~/utils/bible/formatting-assembly';
import {
  formatReference,
  formatReferenceForCopy,
  parseReferenceId,
} from '~/utils/bible/reference';

interface BibleViewerClientProps {
  chapters: IRChapter[];
}

function BibleViewerClient({ chapters }: BibleViewerClientProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const currentReference = useBibleStore((state) => state.currentReference);
  const setContainerRef = useBibleViewerStore((state) => state.setContainerRef);
  const setVirtualizer = useBibleViewerStore((state) => state.setVirtualizer);
  const setSlimChapters = useBibleViewerStore((state) => state.setChapters);
  const slimChapters = useBibleViewerStore((state) => state.chapters);

  const isHydrated = useLayoutStore((state) => state.isHydrated);
  const initialScrollDone = useLayoutStore((state) => state.initialScrollDone);
  const setInitialScrollDone = useLayoutStore(
    (state) => state.setInitialScrollDone
  );

  // Create slim version for virtualization and set in store once
  useEffect(() => {
    const newSlimChapters = chapters.map((ch) => ({
      chapterId: ch.chapterId,
      bookName: ch.bookName,
      number: ch.number,
    }));
    setSlimChapters(newSlimChapters);
  }, [chapters, setSlimChapters]);

  const virtualizer = useVirtualizer({
    count: slimChapters.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 1800,
    overscan: 1,
    enabled: true,
  });

  // Store refs in global store
  useEffect(() => {
    console.log('setting refs in global store');
    setContainerRef(parentRef);
    setVirtualizer(virtualizer);
  }, [setContainerRef, setVirtualizer, virtualizer]);

  useVerseTracking({ containerRef: parentRef });

  const scrollToReference = useScrollToReference({
    chapters: slimChapters,
    virtualizer,
    containerRef: parentRef,
    setInitialScrollDone,
  });

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
