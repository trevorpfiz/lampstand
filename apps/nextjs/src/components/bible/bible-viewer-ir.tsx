"use client";

import type { JSX } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Tooltip, TooltipContent, TooltipTrigger } from "@lamp/ui/tooltip";

import type { ChapterData, Root, Verse } from "~/types/bible";
import bibleData from "~/public/ordered_bible.json";
import { parseBibleDataTwoPhase } from "~/utils/bible/parse-usj-ir";
import { verseId } from "~/utils/bible/verse";

function getVerseText(verse: Verse): (JSX.Element | string)[] {
  return verse.segments.flatMap((seg, i) => {
    if (seg.type === "text") {
      const parts = seg.content.split("\n");
      return parts
        .map((p, idx) =>
          idx < parts.length - 1
            ? [
                <React.Fragment key={`${i}-${idx}`}>{p}</React.Fragment>,
                <br key={`${i}-br-${idx}`} />,
              ]
            : [<React.Fragment key={`${i}-${idx}`}>{p}</React.Fragment>],
        )
        .flat();
    } else {
      // footnote
      return [
        <Tooltip key={`tooltip-${i}`}>
          <TooltipTrigger>
            <sup className="footnote inline-block cursor-pointer text-xs font-semibold italic text-blue-500">
              {seg.letter ?? "*"}
            </sup>
          </TooltipTrigger>
          <TooltipContent showArrow={true}>
            <p className="max-w-48">{seg.content}</p>
          </TooltipContent>
        </Tooltip>,
      ];
    }
  });
}

function renderBlock(
  block: ChapterData["formattedBlocks"][number],
  chapter: ChapterData,
  key: number,
) {
  switch (block.type) {
    case "heading":
    case "subheading":
      return (
        <h2
          key={key}
          className={
            block.type === "heading" ? "my-4 font-bold" : "my-4 italic"
          }
        >
          {block.lines?.join("")}
        </h2>
      );
    case "blank":
      return <div key={key} className="mb-4" />;
    case "paragraph":
    case "poetry": {
      const indent =
        block.type === "poetry" && block.marker.startsWith("q2")
          ? "2em"
          : "1em";
      const style =
        block.type === "poetry"
          ? { textIndent: indent, textAlign: "justify" as const }
          : { textAlign: "justify" as const };

      // If no verses in this block, just lines
      if (block.verses.length === 0) {
        return (
          <p key={key} style={style}>
            {block.lines?.join("")}
          </p>
        );
      }

      // Render verses
      return (
        <p key={key} style={style}>
          {block.verses.map((vnum, idx) => {
            const verse = chapter.verses[vnum];
            if (!verse) return null;
            const vId = verseId({
              book: chapter.bookName,
              chapter: parseInt(chapter.chapterNumber, 10),
              verse: verse.number,
            });
            const verseContent = getVerseText(verse);

            return (
              <span key={idx} data-verse-id={vId}>
                <span className="align-text-top text-[11px] font-medium">
                  {verse.number}{" "}
                </span>
                {verseContent}{" "}
              </span>
            );
          })}
        </p>
      );
    }
    case "other":
    default:
      return (
        <p key={key} className="mb-4 text-justify">
          {block.lines?.join(" ")}
        </p>
      );
  }
}

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
      const verseEls = Array.from(
        parentRef.current?.querySelectorAll("[data-verse-id]") ?? [],
      );
      const selected = verseEls.filter((el) => range.intersectsNode(el));
      if (selected.length === 0) return;

      e.preventDefault();

      // Determine book and chapter from the first selected verse
      const firstParts =
        selected[0]?.getAttribute("data-verse-id")?.split("-") ?? [];
      const bookNameCap = firstParts[0] ?? "Unknown";
      const chapterNum = firstParts[1] ?? "1";
      const bookName =
        bookNameCap.charAt(0).toUpperCase() +
        bookNameCap.slice(1).toLowerCase();

      let startVerse = Infinity;
      let endVerse = -Infinity;

      const selectedRangeFragment = range.cloneContents();
      Array.from(selectedRangeFragment.querySelectorAll("sup")).forEach((fn) =>
        fn.remove(),
      );

      const selectedFragmentVerses = Array.from(
        selectedRangeFragment.querySelectorAll("[data-verse-id]"),
      );
      const verseTexts: string[] = [];
      for (const vEl of selectedFragmentVerses) {
        const vParts = vEl.getAttribute("data-verse-id")?.split("-") ?? [];
        const verseNum = parseInt(vParts[2] ?? "0", 10);
        if (verseNum < startVerse) startVerse = verseNum;
        if (verseNum > endVerse) endVerse = verseNum;
        const vText = vEl.textContent?.trim() ?? "";
        verseTexts.push(vText);
      }

      if (verseTexts.length === 0) return;
      const combinedText = verseTexts.join(" ");
      let referenceLine = `— ${bookName} ${chapterNum}:${startVerse}`;
      if (endVerse > startVerse) {
        referenceLine += `-${endVerse}`;
      }

      const finalText = combinedText + "\n" + referenceLine;
      e.clipboardData?.setData("text/plain", finalText);
    };

    const container = parentRef.current;
    container?.addEventListener("copy", handleCopy);
    return () => {
      container?.removeEventListener("copy", handleCopy);
    };
  }, []);

  const virtualItems = virtualizer.getVirtualItems();
  let lastBookCode: string | null = null;

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

              const isNewBook = chapter.bookCode !== lastBookCode;
              lastBookCode = chapter.bookCode;

              const showBookName = isNewBook && chapter.chapterNumber === "1";

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className="p-2"
                >
                  {showBookName && (
                    <h1
                      key="bookname"
                      className="my-6 text-center text-4xl font-bold"
                    >
                      {chapter.bookName.toUpperCase()}
                    </h1>
                  )}

                  {chapter.formattedBlocks.map((block, idx) =>
                    renderBlock(block, chapter, idx),
                  )}
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
