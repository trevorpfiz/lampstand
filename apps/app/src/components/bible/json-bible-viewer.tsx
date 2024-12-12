"use client";

import React, { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import bibleData from "~/public/web.json";

// Define types based on the JSON Bible Format
interface BibleVerse {
  type: "verse";
  bookName: string;
  chapterNumber: number;
  number: number;
  text: string;
}

interface BibleChapter {
  type: "chapter";
  bookName: string;
  number: number;
}

interface BibleBook {
  type: "book";
  name: string;
}

type BibleItem = BibleBook | BibleChapter | BibleVerse;

interface BibleJson {
  books: {
    name: string;
    chapters: {
      number: number;
      verses: {
        number: number;
        text: string;
      }[];
    }[];
  }[];
}

const JsonBibleViewer = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<BibleItem[]>([]);
  const [enabled] = useState(true);

  // Process the Bible JSON data into a flat list of items
  useEffect(() => {
    const processedItems: BibleItem[] = [];
    const data = bibleData as BibleJson;

    data.books.forEach((book) => {
      // Add book header
      processedItems.push({ type: "book", name: book.name });

      book.chapters.forEach((chapter) => {
        // Add chapter header
        processedItems.push({
          type: "chapter",
          bookName: book.name,
          number: chapter.number,
        });

        // Add verses
        chapter.verses.forEach((verse) => {
          processedItems.push({
            type: "verse",
            bookName: book.name,
            chapterNumber: chapter.number,
            number: verse.number,
            text: verse.text,
          });
        });
      });
    });

    setItems(processedItems);
  }, []);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 5,
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
          height: virtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
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
            const item = items[virtualRow.index];
            if (!item) return null;

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="p-2"
              >
                {item.type === "book" && (
                  <h1 className="mb-2 mt-6 text-3xl font-bold">{item.name}</h1>
                )}
                {item.type === "chapter" && (
                  <h2 className="mb-1 mt-4 text-2xl font-semibold">
                    Chapter {item.number}
                  </h2>
                )}
                {item.type === "verse" && (
                  <p className="mb-1">
                    <span className="font-bold">{item.number}</span> {item.text}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { JsonBibleViewer };
