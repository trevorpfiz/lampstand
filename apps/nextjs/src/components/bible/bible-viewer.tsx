"use client";

import React, { useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Tooltip, TooltipContent, TooltipTrigger } from "@lamp/ui/tooltip";

import bibleData from "~/public/ordered_bible.json";

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

type ParagraphItem = string | VerseToken | NoteSegment;

interface NoteSegment {
  type: "note";
  letter: string;
  text: string;
}

interface ChapterElement {
  type: string;
  marker: string;
  lines: ParagraphItem[];
}

interface ChapterData {
  bookCode: string;
  bookName: string;
  chapterNumber: string;
  elements: ChapterElement[];
}

function extractNoteText(content: (string | ContentNode)[]): string {
  return content
    .map((c) => (typeof c === "string" ? c : (c.content?.join("") ?? "")))
    .join("")
    .trim();
}

/**
 * Checks if content array contains any verse node.
 * If it does, we should treat the paragraph as containing verses and parse accordingly.
 */
function containsVerseNode(
  content: (string | ContentNode)[] | undefined,
): boolean {
  if (!content) return false;
  return content.some((item) => {
    if (typeof item !== "string" && item.type === "verse") {
      return true;
    }
    return false;
  });
}

function parseParagraphContent(
  content: (string | ContentNode)[],
  footnoteIndexRef: { index: number },
): ParagraphItem[] {
  const result: ParagraphItem[] = [];
  let currentVerse: VerseToken | null = null;
  let lastVerseTokenIndex: number | null = null; // Track index of last verse token in result

  const startNewVerse = (verseNumber: string) => {
    finishCurrentVerse();
    currentVerse = { type: "verse", verse: verseNumber, segments: [] };
  };

  const finishCurrentVerse = () => {
    if (currentVerse) {
      result.push(currentVerse);
      lastVerseTokenIndex = result.length - 1;
      currentVerse = null;
    }
  };

  for (const item of content) {
    if (typeof item === "string") {
      if (currentVerse) {
        currentVerse.segments.push({ type: "text", text: item });
      } else {
        // Text outside a verse - push as a string line
        // Check if the last item is a string and concatenate
        if (
          result.length > 0 &&
          typeof result[result.length - 1] === "string"
        ) {
          result[result.length - 1] =
            (result[result.length - 1] as string) + item;
        } else {
          result.push(item);
        }
      }
    } else {
      // It's a node
      if (item.type === "verse") {
        startNewVerse(item.number ?? "");
      } else if (item.type === "note" && item.marker === "f") {
        // Footnote inline
        footnoteIndexRef.index++;
        const letter = String.fromCharCode(96 + footnoteIndexRef.index); // a, b, c...
        const noteText = extractNoteText(item.content || []);
        if (currentVerse) {
          // If currently in a verse, append note to current verse
          currentVerse.segments.push({ type: "note", letter, text: noteText });
        } else {
          // Not currently in a verse
          // If we have a last verse token, append to it
          if (
            lastVerseTokenIndex !== null &&
            result[lastVerseTokenIndex] &&
            typeof result[lastVerseTokenIndex] !== "string"
          ) {
            const lastVerse = result[lastVerseTokenIndex] as VerseToken;
            lastVerse.segments.push({ type: "note", letter, text: noteText });
          } else {
            // No verse open and no last verse token - push as a note segment
            result.push({
              type: "note",
              letter,
              text: noteText,
            });
          }
        }
      } else {
        // Other node (like char), treat as text
        const flatText = (item.content || [])
          .filter((c) => typeof c === "string")
          .join("");
        if (currentVerse) {
          currentVerse.segments.push({ type: "text", text: flatText });
        } else {
          // Text outside a verse
          if (
            result.length > 0 &&
            typeof result[result.length - 1] === "string"
          ) {
            result[result.length - 1] =
              (result[result.length - 1] as string) + flatText;
          } else {
            result.push(flatText);
          }
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
    let footnoteIndexRef = { index: 0 };

    for (const node of content) {
      if (node.type === "chapter" && node.marker === "c") {
        // Finish previous chapter if any
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
        const marker = node.marker || "";
        const nodeContent = node.content ?? [];

        if (marker === "s1") {
          const headingText = nodeContent.join("").trim();
          currentChapter.elements.push({
            type: "heading",
            marker: "s1",
            lines: [headingText],
          });
        } else if (marker === "s2") {
          const headingText = nodeContent.join("").trim();
          currentChapter.elements.push({
            type: "subheading",
            marker: "s2",
            lines: [headingText],
          });
        } else if (
          // Treat paragraphs that contain verses the same way as 'm'/'p'
          // This includes pmo, q lines that contain verse nodes, etc.
          marker === "m" ||
          marker === "p" ||
          marker === "pmo" ||
          (marker.startsWith("q") && containsVerseNode(nodeContent))
        ) {
          const lines = parseParagraphContent(nodeContent, footnoteIndexRef);
          currentChapter.elements.push({
            type: "paragraph",
            marker,
            lines,
          });
        } else if (marker.startsWith("q")) {
          // Poetry line, possibly with notes
          const lines = parseParagraphContent(nodeContent, footnoteIndexRef);
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
          // Other paragraph types with no verses
          if (nodeContent.length > 0) {
            const lines = nodeContent.map((c) =>
              typeof c === "string" ? c : "",
            );
            currentChapter.elements.push({
              type: "other",
              marker,
              lines,
            });
          }
        }
      }
    }

    // Finish last chapter
    if (currentChapter) {
      chapters.push(currentChapter);
    }
  }

  return chapters;
}

// Render helpers
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
                <sup className="inline-block cursor-pointer text-xs font-semibold text-blue-500">
                  {item.letter}
                </sup>
              </TooltipTrigger>
              <TooltipContent>
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
  chapterNumber: string,
  chapterNumberPrintedRef: { printed: boolean },
  elementKey: number,
) {
  return (
    <p key={`paragraph-${elementKey}`} className="text-justify">
      {lines.map((item, i) => {
        if (typeof item === "string") {
          return <React.Fragment key={`line-${i}`}>{item}</React.Fragment>;
        } else if (item.type === "note") {
          // Render notes outside of verses
          return (
            <Tooltip key={`note-${i}`}>
              <TooltipTrigger>
                <sup className="inline-block cursor-pointer text-xs font-semibold text-blue-500">
                  {item.letter}
                </sup>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-48">{item.text}</p>
              </TooltipContent>
            </Tooltip>
          );
        } else {
          // VerseToken
          let prefix: React.ReactNode = null;
          if (!chapterNumberPrintedRef.printed) {
            // Print the large bold chapter number and skip verse number
            prefix = (
              <span
                key={`chapterNumber-${i}`}
                className="pr-2 align-middle text-2xl font-bold"
              >
                {chapterNumber}
              </span>
            );
            chapterNumberPrintedRef.printed = true;
          } else {
            // Print verse number
            prefix = (
              <span
                key={`verseNum-${i}`}
                className="pr-1 align-text-top text-[11px] font-medium"
              >
                {item.verse}
              </span>
            );
          }

          return (
            <React.Fragment key={`verseToken-${i}`}>
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
}

const BibleViewer: React.FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [enabled] = useState(true);

  const chapters = useMemo(() => parseBibleData(bibleData), []);

  const virtualizer = useVirtualizer({
    count: chapters.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 1800,
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
                      chapter.chapterNumber,
                      chapterNumberPrintedRef,
                      idx,
                    );
                  } else if (el.type === "poetry") {
                    return renderPoetryLines(el.lines, el.marker, idx * 1000);
                  } else if (el.type === "blank") {
                    return <div key={`blank-${idx}`} className="mb-4" />;
                  } else {
                    // other
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
  );
};

export default BibleViewer;
