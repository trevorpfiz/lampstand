"use client";

import React, { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import bible from "~/public/bible.json";

// Core interfaces for Bible data
interface BibleVerse {
  type: "verse";
  marker: "v";
  number: string;
  sid: string;
  content?: string;
}

interface BiblePara {
  type: "para";
  marker: string;
  content?: string[];
}

interface BibleChapter {
  type: "chapter";
  marker: "c";
  number: string;
  sid: string;
}

type BibleItem =
  | { type: "book"; content: string; code: string }
  | { type: "chapter"; number: string; sid: string }
  | { type: "verse"; number: string; text: string }
  | { type: "para"; content: string[] | undefined };

const BibleViewer = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<BibleItem[]>([]);

  // Process Bible data on mount
  useEffect(() => {
    const processedItems: BibleItem[] = [];

    Object.entries(bible).forEach(([bookKey, book]) => {
      // Add book header
      processedItems.push({
        type: "book",
        content:
          book.content.find(
            (item: any) => item.type === "para" && item.marker === "toc1",
          )?.content?.[0] || bookKey,
        code: bookKey,
      });

      // Process book content
      book.content.forEach((item: any) => {
        if (item.type === "chapter") {
          processedItems.push({
            type: "chapter",
            number: item.number,
            sid: item.sid,
          });
        } else if (item.type === "para" && item.marker === "m") {
          // Process verses within paragraphs
          item.content?.forEach((content: any) => {
            if (content.type === "verse") {
              processedItems.push({
                type: "verse",
                number: content.number,
                text:
                  typeof content.content === "string" ? content.content : "",
              });
            }
          });
        } else if (item.type === "para" && item.content) {
          processedItems.push({
            type: "para",
            content: item.content,
          });
        }
      });
    });

    setItems(processedItems);
  }, []);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Initial estimate
    overscan: 5,
    enabled: true,
  });

  return (
    <div ref={parentRef} className="h-full overflow-auto p-4 pt-0">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              ref={virtualizer.measureElement}
              data-index={virtualRow.index}
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {item.type === "book" && (
                <h1 className="my-4 text-3xl font-bold">{item.content}</h1>
              )}
              {item.type === "chapter" && (
                <h2 className="my-2 text-2xl font-semibold">
                  Chapter {item.number}
                </h2>
              )}
              {item.type === "verse" && (
                <p className="my-1">
                  <span className="font-bold">{item.number}</span> {item.text}
                </p>
              )}
              {item.type === "para" && item.content && (
                <p className="my-1">{item.content.join(" ")}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BibleViewer;
