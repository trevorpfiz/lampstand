"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import type { Root } from "~/types/bible";
import bibleData from "~/public/ordered_bible.json";
import { renderChapter } from "~/utils/bible/formatting-assembly";
import { parseBibleDataTwoPhase } from "~/utils/bible/parse-usj-ir";

const BibleViewer: React.FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const chapters = useMemo(() => parseBibleDataTwoPhase(bibleData as Root), []);

  const [enabled] = useState(true);
  const virtualizer = useVirtualizer({
    count: chapters.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 1800,
    overscan: 3,
    enabled,
  });

  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      console.log("Selected Text:", selection.toString());
      console.log("Range startContainer:", range.startContainer);
      console.log("Range endContainer:", range.endContainer);
      console.log(
        "Range commonAncestorContainer:",
        range.commonAncestorContainer,
      );

      const verseEls = Array.from(
        parentRef.current?.querySelectorAll("[data-verse-id]") ?? [],
      );
      console.log("All Verse Elements:", verseEls);

      const selectedVerseEls = verseEls.filter((el) => {
        const intersects = range.intersectsNode(el);
        console.log(
          `Element ID: ${el.getAttribute("data-verse-id")}, Intersects:`,
          intersects,
        );
        return intersects;
      });

      console.log(
        "Selected Verse Elements:",
        selectedVerseEls.map((el) => el.getAttribute("data-verse-id")),
      );

      if (selectedVerseEls.length === 0) {
        return; // Allow default copy if no verses are selected
      }

      e.preventDefault();

      // Handle single verse case
      if (selectedVerseEls.length === 1) {
        const verseEl = selectedVerseEls[0];
        console.log("Single Verse Selected:", verseEl);

        // Determine if it's a partial selection
        const isPartial =
          range.startContainer !== verseEl && range.endContainer !== verseEl;

        if (isPartial) {
          // Use the cloned content from the range for partial selection
          const partialFragment = range.cloneContents();

          // Remove footnotes
          Array.from(partialFragment.querySelectorAll("sup")).forEach((fn) =>
            fn.remove(),
          );

          const partialText = partialFragment.textContent?.trim() ?? "";
          const verseId = verseEl.getAttribute("data-verse-id") ?? "";
          const [bookRaw, chapterStr, verseNum] = verseId.split("-", 3);
          const bookName =
            bookRaw.charAt(0).toUpperCase() + bookRaw.slice(1).toLowerCase();
          const referenceLine = `— ${bookName} ${chapterStr}:${verseNum}`;

          const finalText = `${partialText}\n${referenceLine}`;
          console.log("Final Text to Copy (Partial Single Verse):", finalText);

          e.clipboardData?.setData("text/plain", finalText);
          return;
        } else {
          // Full single verse selection
          const verseClone = verseEl.cloneNode(true) as HTMLElement;
          Array.from(verseClone.querySelectorAll("sup")).forEach((fn) =>
            fn.remove(),
          );

          const verseText = verseClone.textContent?.trim() ?? "";
          const verseId = verseEl.getAttribute("data-verse-id") ?? "";
          const [bookRaw, chapterStr, verseNum] = verseId.split("-", 3);
          const bookName =
            bookRaw.charAt(0).toUpperCase() + bookRaw.slice(1).toLowerCase();
          const referenceLine = `— ${bookName} ${chapterStr}:${verseNum}`;

          const finalText = `${verseText}\n${referenceLine}`;
          console.log("Final Text to Copy (Full Single Verse):", finalText);

          e.clipboardData?.setData("text/plain", finalText);
          return;
        }
      }

      // Handle multiple verses or partial selection across verses
      const selectedRangeFragment = range.cloneContents();
      console.log("Cloned Fragment Before Removal:", selectedRangeFragment);

      Array.from(selectedRangeFragment.querySelectorAll("sup")).forEach(
        (fn) => {
          console.log("Removing Footnote:", fn);
          fn.remove();
        },
      );

      const fragmentVerseEls = Array.from(
        selectedRangeFragment.querySelectorAll("[data-verse-id]"),
      );
      console.log(
        "Extracted Verse IDs:",
        fragmentVerseEls.map((el) => el.getAttribute("data-verse-id")),
      );

      if (fragmentVerseEls.length === 0) {
        const rawSelectedText = selection.toString().trim();
        console.log("Fallback to Raw Text:", rawSelectedText);
        e.clipboardData?.setData("text/plain", rawSelectedText);
        return;
      }

      // Construct text and reference for multiple verses
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

      const firstId = fragmentVerseEls[0].getAttribute("data-verse-id") ?? "";
      const [bookRaw, chapterStr] = firstId.split("-", 3);
      const bookName =
        bookRaw.charAt(0).toUpperCase() + bookRaw.slice(1).toLowerCase();

      let referenceLine = `— ${bookName} ${chapterStr}:${startVerse}`;
      if (endVerse > startVerse) {
        referenceLine += `-${endVerse}`;
      }

      const combinedText = verseTexts.join(" ");
      const finalText = `${combinedText}\n${referenceLine}`;

      console.log("Final Text to Copy (Multiple Verses):", finalText);
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
      <div
        ref={parentRef}
        className="flex-1 overflow-auto px-3"
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
};

export default BibleViewer;
