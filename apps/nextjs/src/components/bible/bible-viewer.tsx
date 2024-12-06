"use client";

import React, { useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Tooltip, TooltipContent, TooltipTrigger } from "@lamp/ui/tooltip";

import bibleData from "~/public/bible.json";

interface ContentNode {
  type: string;
  marker?: string;
  number?: string;
  sid?: string;
  content?: (string | ContentNode)[];
}

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

type ParagraphItem = string | VerseToken;

interface ChapterData {
  bookCode: string;
  bookName: string;
  chapterNumber: string;
  elements: {
    type: string;
    marker: string;
    lines: ParagraphItem[];
  }[];
}

function extractNoteText(content: (string | ContentNode)[]): string {
  return content
    .map((c) => (typeof c === "string" ? c : (c.content?.join("") ?? "")))
    .join("")
    .trim();
}

function parseParagraphContent(
  content: (string | ContentNode)[],
  footnoteIndexRef: { index: number },
): ParagraphItem[] {
  const result: ParagraphItem[] = [];
  let currentVerse: VerseToken | null = null;

  const startNewVerse = (verseNumber: string) => {
    if (currentVerse) result.push(currentVerse);
    currentVerse = { type: "verse", verse: verseNumber, segments: [] };
  };

  const finishCurrentVerse = () => {
    if (currentVerse) {
      result.push(currentVerse);
      currentVerse = null;
    }
  };

  for (const item of content) {
    if (typeof item === "string") {
      if (currentVerse) {
        currentVerse.segments.push({ type: "text", text: item });
      } else {
        result.push(item);
      }
    } else {
      if (item.type === "verse") {
        // Start a new verse token
        startNewVerse(item.number ?? "");
      } else if (item.type === "note" && item.marker === "f") {
        // Footnote inline
        footnoteIndexRef.index++;
        const letter = String.fromCharCode(96 + footnoteIndexRef.index); // a, b, c...
        const noteText = extractNoteText(item.content || []);
        if (currentVerse) {
          currentVerse.segments.push({ type: "note", letter, text: noteText });
        } else {
          // Note outside a verse - rare
          result.push(`[${letter}] ${noteText}`);
        }
      } else {
        // Other node (e.g. char) - treat as text
        const flatText = (item.content || [])
          .filter((c) => typeof c === "string")
          .join("");
        if (currentVerse) {
          currentVerse.segments.push({ type: "text", text: flatText });
        } else {
          result.push(flatText);
        }
      }
    }
  }

  finishCurrentVerse();
  return result;
}

function parseBibleData(data: any): ChapterData[] {
  const chapters: ChapterData[] = [];

  for (const [bookCode, bookObj] of Object.entries<any>(data)) {
    const content = bookObj.content as ContentNode[];
    const bookName =
      content.find((c) => c.marker === "mt1")?.content?.[0]?.trim() || bookCode;

    let currentChapter: ChapterData | null = null;
    let footnoteIndexRef = { index: 0 }; // reset per chapter

    for (const node of content) {
      if (node.type === "chapter" && node.marker === "c") {
        // If we were in a chapter, push it before starting a new one
        if (currentChapter) {
          chapters.push(currentChapter);
        }
        currentChapter = {
          bookCode,
          bookName,
          chapterNumber: node.number,
          elements: [],
        };
        footnoteIndexRef = { index: 0 };
      } else if (node.type === "para" && currentChapter) {
        const marker = node.marker;

        if (marker === "s1") {
          const headingText = (node.content ?? []).join("").trim();
          currentChapter.elements.push({
            type: "heading",
            marker: "s1",
            lines: [headingText],
          });
        } else if (marker === "m" || marker === "p") {
          const lines = parseParagraphContent(
            node.content ?? [],
            footnoteIndexRef,
          );
          currentChapter.elements.push({
            type: "paragraph",
            marker: "m",
            lines,
          });
        } else if (marker?.startsWith("q")) {
          const lines = (node.content ?? []).map((c) =>
            typeof c === "string" ? c : "",
          );
          currentChapter.elements.push({
            type: "poetry",
            marker,
            lines,
          });
        } else if (marker === "b") {
          currentChapter.elements.push({
            type: "blank",
            marker: "b",
            lines: [],
          });
        } else {
          if (node.content && node.content.length > 0) {
            const lines = node.content.map((c) =>
              typeof c === "string" ? c : "",
            );
            currentChapter.elements.push({
              type: "other",
              marker: marker ?? "",
              lines,
            });
          }
        }
      }
    }

    // Push the last chapter if it exists
    if (currentChapter) {
      chapters.push(currentChapter);
    }
  }

  return chapters;
}

const BibleViewer: React.FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [enabled] = useState(true);

  const chapters = useMemo(() => parseBibleData(bibleData), []);

  const virtualizer = useVirtualizer({
    count: chapters.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 600,
    overscan: 1,
    enabled,
  });

  const virtualItems = virtualizer.getVirtualItems();

  let lastBookCode: string | null = null;

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto px-3"
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
            let chapterNumberPrinted = false;

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="p-2"
              >
                {showBookName && (
                  <h1 className="my-6 text-center text-4xl font-bold">
                    {chapter.bookName.toUpperCase()}
                  </h1>
                )}

                {chapter.elements.map((el, idx) => {
                  if (el.type === "heading") {
                    // Now bold instead of italic
                    return (
                      <h2 key={idx} className="my-4 font-bold">
                        {el.lines.join("").trim()}
                      </h2>
                    );
                  } else if (el.type === "paragraph") {
                    return (
                      <p
                        key={idx}
                        style={{ textAlign: "justify", marginBottom: "1rem" }}
                      >
                        {el.lines.map((item, i) => {
                          if (typeof item === "string") {
                            return (
                              <React.Fragment key={i}>{item}</React.Fragment>
                            );
                          } else {
                            // VerseToken
                            let prefix: React.ReactNode = null;
                            if (!chapterNumberPrinted) {
                              // Print the large bold chapter number and skip the verse number
                              prefix = (
                                <span className="pr-2 align-middle text-2xl font-bold">
                                  {chapter.chapterNumber}
                                </span>
                              );
                              chapterNumberPrinted = true;
                            } else {
                              // For subsequent verses, print the verse number
                              prefix = (
                                <span className="pr-1 align-text-top text-[11px] font-medium">
                                  {item.verse}
                                </span>
                              );
                            }

                            return (
                              <React.Fragment key={i}>
                                {prefix}
                                {item.segments.map((seg, j) => {
                                  if (seg.type === "text") {
                                    return (
                                      <React.Fragment key={j}>
                                        {seg.text}
                                      </React.Fragment>
                                    );
                                  } else if (seg.type === "note") {
                                    return (
                                      <Tooltip key={j}>
                                        <TooltipTrigger>
                                          <sup className="inline-block cursor-pointer text-xs font-semibold text-blue-500">
                                            {seg.letter}
                                          </sup>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="max-w-48">{seg.text}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    );
                                  } else {
                                    return null;
                                  }
                                })}
                              </React.Fragment>
                            );
                          }
                        })}
                      </p>
                    );
                  } else if (el.type === "poetry") {
                    const indentation = el.marker === "q2" ? "2em" : "1em";
                    return el.lines.map((l, i) => (
                      <p
                        key={i}
                        style={{
                          textAlign: "justify",
                          textIndent: indentation,
                        }}
                      >
                        {l.trim()}
                      </p>
                    ));
                  } else if (el.type === "blank") {
                    return <div key={idx} style={{ margin: "1em 0" }} />;
                  } else {
                    return (
                      <p
                        key={idx}
                        style={{ marginBottom: "1rem", textAlign: "justify" }}
                      >
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
  );
};

export default BibleViewer;
