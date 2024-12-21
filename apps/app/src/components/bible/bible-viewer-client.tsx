"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import type { IRChapter } from "~/utils/bible/formatting-assembly";
import { VerseNavigationBar } from "~/components/bible/verse-navigation-bar";
import { useVerseTracking } from "~/hooks/use-verse-tracking";
import { useBibleStore } from "~/providers/bible-store-provider";
import { useLayoutStore } from "~/providers/layout-store-provider";
import { renderChapter } from "~/utils/bible/formatting-assembly";
import { verseId } from "~/utils/bible/verse";

interface BibleViewerClientProps {
  chapters: IRChapter[];
}

function BibleViewerClient({ chapters }: BibleViewerClientProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const currentVerse = useBibleStore((state) => state.currentVerse);

  const isHydrated = useLayoutStore((state) => state.isHydrated);
  const initialScrollDone = useLayoutStore((state) => state.initialScrollDone);
  const setInitialScrollDone = useLayoutStore(
    (state) => state.setInitialScrollDone,
  );

  const virtualizer = useVirtualizer({
    count: chapters.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 1800,
    overscan: 1,
    enabled: true,
  });

  useVerseTracking({ containerRef: parentRef });

  const scrollToChapterAndVerse = useCallback(
    (chapterIndex: number, verse?: string, initial?: boolean) => {
      virtualizer.scrollToIndex(chapterIndex, { align: "start" });

      setTimeout(() => {
        if (verse && parentRef.current) {
          const el = parentRef.current.querySelector(
            `[data-verse-id='${verse}']`,
          );
          if (el instanceof HTMLElement) {
            const parentRect = parentRef.current.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            const offset =
              elRect.top - parentRect.top + parentRef.current.scrollTop;
            parentRef.current.scrollTo({ top: offset, behavior: "smooth" });
          }
        }
      }, 200);

      if (initial) {
        setInitialScrollDone(true);
      }
    },
    [setInitialScrollDone, virtualizer],
  );

  // Perform initial scroll after hydration and only if not done already
  useLayoutEffect(() => {
    if (initialScrollDone || !isHydrated) return;
    requestAnimationFrame(() => {
      const chapterIndex = chapters.findIndex(
        (ch) =>
          ch.bookName.toLowerCase() === currentVerse.book.toLowerCase() &&
          ch.number === currentVerse.chapter,
      );

      if (chapterIndex !== -1) {
        const verse = verseId(currentVerse);
        scrollToChapterAndVerse(chapterIndex, verse, true);
      } else {
        setInitialScrollDone(true);
      }
    });
  }, [
    chapters,
    currentVerse,
    initialScrollDone,
    isHydrated,
    scrollToChapterAndVerse,
    setInitialScrollDone,
  ]);

  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      const verseEls = Array.from(
        parentRef.current?.querySelectorAll("[data-verse-id]") ?? [],
      );

      const selectedVerseEls = verseEls.filter((el) =>
        range.intersectsNode(el),
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
          Array.from(partialFragment.querySelectorAll("sup")).forEach((fn) =>
            fn.remove(),
          );

          const partialText = partialFragment.textContent?.trim() ?? "";
          const verseId = verseEl?.getAttribute("data-verse-id") ?? "";
          const [bookRaw = "Genesis", chapterStr, verseNum] = verseId.split(
            "-",
            3,
          );
          const bookName =
            bookRaw.charAt(0).toUpperCase() + bookRaw.slice(1).toLowerCase();
          const referenceLine = `— ${bookName} ${chapterStr}:${verseNum}`;

          const finalText = `${partialText}\n${referenceLine}`;
          e.clipboardData?.setData("text/plain", finalText);
          return;
        } else {
          const verseClone = verseEl.cloneNode(true) as HTMLElement;
          Array.from(verseClone.querySelectorAll("sup")).forEach((fn) =>
            fn.remove(),
          );

          const verseText = verseClone.textContent?.trim() ?? "";
          const verseId = verseEl.getAttribute("data-verse-id") ?? "";
          const [bookRaw = "Genesis", chapterStr, verseNum] = verseId.split(
            "-",
            3,
          );
          const bookName =
            bookRaw.charAt(0).toUpperCase() + bookRaw.slice(1).toLowerCase();
          const referenceLine = `— ${bookName} ${chapterStr}:${verseNum}`;

          const finalText = `${verseText}\n${referenceLine}`;

          e.clipboardData?.setData("text/plain", finalText);
          return;
        }
      }

      // Multiple verses or partial selection across verses
      const selectedRangeFragment = range.cloneContents();
      Array.from(selectedRangeFragment.querySelectorAll("sup")).forEach((fn) =>
        fn.remove(),
      );

      const fragmentVerseEls = Array.from(
        selectedRangeFragment.querySelectorAll("[data-verse-id]"),
      );

      if (fragmentVerseEls.length === 0) {
        const rawSelectedText = selection.toString().trim();
        e.clipboardData?.setData("text/plain", rawSelectedText);
        return;
      }

      const verseTexts: string[] = [];
      let startVerse = Infinity;
      let endVerse = -Infinity;

      fragmentVerseEls.forEach((vEl) => {
        const vId = vEl.getAttribute("data-verse-id") ?? "";
        const parts = vId.split("-");
        const verseNum = parseInt(parts[2] ?? "0", 10);
        if (verseNum < startVerse) startVerse = verseNum;
        if (verseNum > endVerse) endVerse = verseNum;

        const verseText = vEl.textContent?.trim() ?? "";
        if (verseText) verseTexts.push(verseText);
      });

      if (verseTexts.length === 0) {
        verseTexts.push("");
      }

      const firstId = fragmentVerseEls[0]?.getAttribute("data-verse-id") ?? "";
      const [bookRaw = "", chapterStr = ""] = firstId.split("-", 3);
      const bookName =
        bookRaw.charAt(0).toUpperCase() + bookRaw.slice(1).toLowerCase();

      let referenceLine = `— ${bookName} ${chapterStr}:${startVerse}`;
      if (endVerse > startVerse) {
        referenceLine += `-${endVerse}`;
      }

      const combinedText = verseTexts.join(" ");
      const finalText = `${combinedText}\n${referenceLine}`;

      e.clipboardData?.setData("text/plain", finalText);
    };

    const container = parentRef.current;
    container?.addEventListener("copy", handleCopy);
    return () => {
      container?.removeEventListener("copy", handleCopy);
    };
  }, []);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="flex h-full flex-col">
      <VerseNavigationBar
        scrollToChapterAndVerse={scrollToChapterAndVerse}
        getChapterIndex={(book, chapter) =>
          chapters.findIndex(
            (ch) =>
              ch.bookName.toLowerCase() === book.toLowerCase() &&
              ch.number === chapter,
          )
        }
      />
      <div
        ref={parentRef}
        className="default-scrollbar flex-1 overflow-auto px-3"
        style={{ contain: "strict" }}
      >
        <div
          style={{
            position: "relative",
            height: virtualizer.getTotalSize(),
            width: "100%",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
            }}
          >
            {virtualItems.map((virtualRow) => {
              const chapter = chapters[virtualRow.index];
              if (!chapter) return null;

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
