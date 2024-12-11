"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { cn } from "@lamp/ui";
import { useTheme } from "@lamp/ui/theme";
import { Tooltip, TooltipContent, TooltipTrigger } from "@lamp/ui/tooltip";

import type { ChapterData } from "~/utils/bible/parse-usj";
import type { VerseReference } from "~/utils/bible/verse";
import { VerseNavigationBar } from "~/components/bible/verse-navigation-bar";
import { useVerseTracking } from "~/hooks/use-verse-tracking";
import { useBibleStore } from "~/providers/bible-store-provider";
import bibleData from "~/public/ordered_bible.json";
import { parseBibleData } from "~/utils/bible/parse-usj";
import { verseId } from "~/utils/bible/verse";

interface VerseSegment {
  type: "text" | "note";
  text?: string;
  letter?: string;
}

interface VerseToken {
  type: "verse";
  verse: string;
  segments: VerseSegment[];
}

type ParagraphItem =
  | string
  | VerseToken
  | { type: "note"; letter: string; text: string };

function renderHeading(lines: ParagraphItem[], key: number) {
  return (
    <h2 key={`heading-${key}`} className="my-4 font-bold">
      {lines.join("").trim()}
    </h2>
  );
}

function renderSubheading(lines: ParagraphItem[], key: number) {
  return (
    <h2 key={`subheading-${key}`} className="my-4 italic">
      {lines.join("").trim()}
    </h2>
  );
}

function renderPoetryLines(
  lines: ParagraphItem[],
  marker: string,
  keyStart: number,
  resolvedTheme: string,
) {
  const indentation = marker === "q2" ? "2em" : "1em";
  return (
    <p
      key={`poetry-${keyStart}`}
      style={{
        textAlign: "justify",
        textIndent: indentation,
      }}
    >
      {lines.map((item, i) => {
        if (typeof item === "string") {
          return (
            <React.Fragment key={`poetry-line-${i}`}>{item}</React.Fragment>
          );
        } else if (item.type === "note") {
          return (
            <Tooltip key={`poetry-note-${i}`}>
              <TooltipTrigger>
                <sup className="inline-block cursor-pointer text-xs font-semibold italic text-blue-500">
                  {item.letter}
                </sup>
              </TooltipTrigger>
              <TooltipContent
                showArrow={true}
                className={cn("", resolvedTheme === "light" && "dark")}
              >
                <p className="max-w-48">{item.text}</p>
              </TooltipContent>
            </Tooltip>
          );
        } else {
          return null;
        }
      })}
    </p>
  );
}

function renderParagraphLines(
  lines: ParagraphItem[],
  chapter: ChapterData,
  chapterNumberPrintedRef: { printed: boolean },
  elementKey: number,
  resolvedTheme: string,
) {
  return (
    <p key={`paragraph-${elementKey}`} className="text-justify">
      {lines.map((item, i) => {
        if (typeof item === "string") {
          return <React.Fragment key={`line-${i}`}>{item}</React.Fragment>;
        } else if (item.type === "note") {
          return (
            <Tooltip key={`note-${i}`}>
              <TooltipTrigger>
                <sup className="inline-block cursor-pointer text-xs font-semibold italic text-blue-500">
                  {item.letter}
                </sup>
              </TooltipTrigger>
              <TooltipContent
                showArrow={true}
                className={cn("", resolvedTheme === "light" && "dark")}
              >
                <p className="max-w-48">{item.text}</p>
              </TooltipContent>
            </Tooltip>
          );
        } else {
          // VerseToken
          const verseNumber = item.verse;
          let prefix: React.ReactNode = null;
          if (!chapterNumberPrintedRef.printed) {
            prefix = (
              <span
                key={`chapterNumber-${i}`}
                className="pr-2 align-middle text-2xl font-bold"
              >
                {chapter.chapterNumber}
              </span>
            );
            chapterNumberPrintedRef.printed = true;
          } else {
            prefix = (
              <span
                key={`verseNum-${i}`}
                className="align-text-top text-[11px] font-medium"
              >
                {verseNumber}{" "}
              </span>
            );
          }

          const verseRef: VerseReference = {
            book: chapter.bookName,
            chapter: parseInt(chapter.chapterNumber, 10),
            verse: parseInt(verseNumber, 10),
          };
          const verseElementId = verseId(verseRef);

          // Make each verse a block-level or at least a distinct element for IntersectionObserver
          return (
            <span data-verse-id={verseElementId} key={`verseToken-${i}`}>
              {prefix}
              {item.segments.map((seg, j) => {
                if (seg.type === "text") {
                  return (
                    <React.Fragment key={`segtext-${i}-${j}`}>
                      {seg.text}
                    </React.Fragment>
                  );
                } else if (seg.type === "note") {
                  return (
                    <Tooltip key={`note-${i}-${j}`}>
                      <TooltipTrigger asChild>
                        <sup className="inline-block cursor-pointer text-xs font-semibold italic text-blue-500">
                          {/* TODO: fix trailing space on elements before, ideally in data cleaning step */}
                          {seg.letter}
                        </sup>
                      </TooltipTrigger>
                      <TooltipContent
                        showArrow={true}
                        className={cn("", resolvedTheme === "light" && "dark")}
                      >
                        <p className="max-w-48">{seg.text}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                } else {
                  return null;
                }
              })}
            </span>
          );
        }
      })}
    </p>
  );
}

const BibleViewer: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const parentRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);
  const [enabled] = useState(true);

  const chapters = useMemo(() => parseBibleData(bibleData), []);

  const virtualizer = useVirtualizer({
    count: chapters.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 1800,
    overscan: 1,
    enabled,
  });

  useVerseTracking({ containerRef: parentRef });

  const currentVerse = useBibleStore((state) => state.currentVerse);
  const isHydrated = useBibleStore((state) => state.isHydrated);

  const scrollToChapterAndVerse = useCallback(
    (chapterIndex: number, verse?: string) => {
      virtualizer.scrollToIndex(chapterIndex, { align: "start" });
      console.log("scrollToChapterAndVerse:", chapterIndex, verse);
      setTimeout(() => {
        if (verse && parentRef.current) {
          const el = document.querySelector(`[data-verse-id='${verse}']`);
          if (el instanceof HTMLElement) {
            const parentRect = parentRef.current.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            const offset =
              elRect.top - parentRect.top + parentRef.current.scrollTop;
            console.log("offset:", offset);
            parentRef.current.scrollTo({ top: offset, behavior: "instant" });
          }
        }
      }, 200);
    },
    [virtualizer],
  );

  useEffect(() => {
    if (!isHydrated || hasScrolledRef.current) return;

    const chapterIndex = chapters.findIndex(
      (ch) =>
        ch.bookName.toLowerCase() === currentVerse.book.toLowerCase() &&
        parseInt(ch.chapterNumber, 10) === currentVerse.chapter,
    );

    if (chapterIndex !== -1) {
      const verse = verseId(currentVerse);
      scrollToChapterAndVerse(chapterIndex, verse);
      hasScrolledRef.current = true;
    }
  }, [currentVerse, chapters, scrollToChapterAndVerse, isHydrated]);

  const virtualItems = virtualizer.getVirtualItems();
  let lastBookCode: string | null = null;

  return (
    <div className="flex h-full flex-col">
      <VerseNavigationBar
        scrollToChapterAndVerse={scrollToChapterAndVerse}
        getChapterIndex={(book, chapter) =>
          chapters.findIndex(
            (ch) =>
              ch.bookName.toLowerCase() === book.toLowerCase() &&
              parseInt(ch.chapterNumber, 10) === chapter,
          )
        }
      />
      <div
        ref={parentRef}
        className="flex-1 overflow-auto px-3"
        style={{
          contain: "strict",
        }}
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
              const chapterNumberPrintedRef = { printed: false };

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

                  {chapter.elements.map((el, idx) => {
                    if (el.type === "heading") {
                      return renderHeading(el.lines, idx);
                    } else if (el.type === "subheading") {
                      return renderSubheading(el.lines, idx);
                    } else if (el.type === "paragraph") {
                      return renderParagraphLines(
                        el.lines,
                        chapter,
                        chapterNumberPrintedRef,
                        idx,
                        resolvedTheme ?? "light",
                      );
                    } else if (el.type === "poetry") {
                      return renderPoetryLines(
                        el.lines,
                        el.marker,
                        idx * 1000,
                        resolvedTheme ?? "light",
                      );
                    } else if (el.type === "blank") {
                      return <div key={`blank-${idx}`} className="mb-4" />;
                    } else {
                      return (
                        <p key={`other-${idx}`} className="mb-4 text-justify">
                          {el.lines.join("").trim()}
                        </p>
                      );
                    }
                  })}
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
