"use client";

import React, { useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import bibleData from "~/public/bible.json";

interface ContentNode {
  type: string;
  marker?: string;
  number?: string;
  sid?: string;
  content?: (string | ContentNode)[];
}

// A structure for a processed chapter
interface ChapterData {
  bookCode: string;
  bookName: string; // If you have a way to map codes to names, do so
  chapterNumber: string;
  elements: {
    type: string;
    marker: string;
    lines: (string | { verse: string; text: string })[];
  }[];
}

// Helper function to recursively extract text segments and verses from a paragraph content array
function extractParagraphLines(
  content: (string | ContentNode)[],
): (string | { verse: string; text: string })[] {
  const lines: (string | { verse: string; text: string })[] = [];

  for (const item of content) {
    if (typeof item === "string") {
      lines.push(item);
    } else if (item.type === "verse") {
      // Subsequent strings after this verse marker until next verse or end of paragraph
      // We'll just mark where the verse starts
      lines.push({ verse: item.number ?? "", text: "" });
    } else {
      // notes, char markers, etc.
      // For simplicity, ignore them or just flatten them out as strings
      if (item.content && Array.isArray(item.content)) {
        const subContent = item.content.filter((c) => typeof c === "string");
        lines.push(subContent.join(""));
      }
    }
  }

  // Now, we might have lines array mixed with {verse, text:""} placeholders and strings.
  // Combine strings after each verse marker into that verse’s text if possible.
  const merged: (string | { verse: string; text: string })[] = [];
  let currentVerse: { verse: string; text: string } | null = null;

  for (const segment of lines) {
    if (typeof segment !== "string") {
      // This is a verse marker
      // If we had a current verse, push it
      if (currentVerse) merged.push(currentVerse);
      currentVerse = { verse: segment.verse, text: "" };
    } else {
      // This is text
      if (currentVerse) {
        currentVerse.text += segment;
      } else {
        // No verse marker yet, this could be a paragraph intro without verse
        // Just push as normal text
        merged.push(segment);
      }
    }
  }

  // Push the last verse if exists
  if (currentVerse) merged.push(currentVerse);

  return merged;
}

// Convert the USJ structure into a list of chapters with structured content
function parseBibleData(data: any): ChapterData[] {
  // We only have one book "RUT" in the provided data sample, but code can generalize.
  // Extract the code, book blocks from data.
  const chapters: ChapterData[] = [];

  for (const [bookCode, bookObj] of Object.entries<any>(data)) {
    const content = bookObj.content as ContentNode[];

    // Identify the book name from the content if available (e.g. from mt1, toc1)
    const bookName =
      content.find((c) => c.marker === "mt1")?.content?.[0]?.trim() || bookCode;

    let currentChapter: ChapterData | null = null;
    for (let i = 0; i < content.length; i++) {
      const node = content[i];

      if (node.type === "chapter" && node.marker === "c") {
        // Start a new chapter block
        if (currentChapter) {
          chapters.push(currentChapter);
        }
        currentChapter = {
          bookCode,
          bookName,
          chapterNumber: node.number,
          elements: [],
        };
      } else if (node.type === "para" && currentChapter) {
        // paragraph
        const marker = node.marker;

        // Some markers to consider:
        // s1 = section heading
        // m = normal paragraph
        // q1, q2 = poetry lines
        // b = blank line
        // h, mt1 = titles
        // We'll just store them as distinct blocks in elements.

        if (marker === "s1") {
          // Section heading
          const headingText = (node.content || []).join("").trim();
          currentChapter.elements.push({
            type: "heading",
            marker: "s1",
            lines: [headingText],
          });
        } else if (marker === "m" || marker === "p") {
          // Normal paragraph with possible verses inside
          const lines = extractParagraphLines(node.content || []);
          currentChapter.elements.push({
            type: "paragraph",
            marker: "m",
            lines,
          });
        } else if (marker?.startsWith("q")) {
          // Poetry line
          // Usually q1, q2 means indentation level
          const lines = (node.content || []).map((c) =>
            typeof c === "string" ? c : "",
          );
          currentChapter.elements.push({
            type: "poetry",
            marker,
            lines,
          });
        } else if (marker === "b") {
          // Blank line
          currentChapter.elements.push({
            type: "blank",
            marker: "b",
            lines: [],
          });
        } else if (marker === "h") {
          // Book title heading (at top)
          // Could be ignored if we already got mt1
        } else {
          // Other paragraph types (r, toc1, etc.) can be handled similarly
          // For now, if there's content, just store them as generic paragraphs
          if (node.content && node.content.length > 0) {
            const lines = (node.content || []).map((c) =>
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

    // push the last chapter if still open
    if (currentChapter) chapters.push(currentChapter);
  }

  return chapters;
}

const BibleViewer: React.FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [enabled] = useState(true);

  // Parse once
  const chapters = useMemo(() => parseBibleData(bibleData), []);

  const virtualizer = useVirtualizer({
    count: chapters.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 600, // rough guess per chapter height
    overscan: 0,
    enabled,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto"
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

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="p-2"
              >
                {/* Chapter Header */}
                <h1 style={{ marginBottom: "0.5rem" }}>
                  {chapter.bookName} {chapter.chapterNumber}
                </h1>

                {chapter.elements.map((el, idx) => {
                  if (el.type === "heading") {
                    return (
                      <h2
                        key={idx}
                        style={{ margin: "1rem 0", fontStyle: "italic" }}
                      >
                        {el.lines.join("").trim()}
                      </h2>
                    );
                  } else if (el.type === "paragraph") {
                    // Paragraph with verses
                    return (
                      <p
                        key={idx}
                        style={{ textAlign: "justify", marginBottom: "1rem" }}
                      >
                        {el.lines.map((line, i) => {
                          if (typeof line === "string") {
                            return (
                              <React.Fragment key={i}>{line}</React.Fragment>
                            );
                          } else {
                            // verse object
                            return (
                              <React.Fragment key={i}>
                                <sup
                                  style={{
                                    fontSize: "0.8em",
                                    verticalAlign: "super",
                                    marginRight: "0.2em",
                                  }}
                                >
                                  {line.verse}
                                </sup>
                                {line.text}
                              </React.Fragment>
                            );
                          }
                        })}
                      </p>
                    );
                  } else if (el.type === "poetry") {
                    // Poetry lines (q1,q2) - indent second-level lines
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
                    // other paragraph types
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
