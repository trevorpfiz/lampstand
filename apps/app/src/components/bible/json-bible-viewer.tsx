'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef, useState } from 'react';

import bibleData from '~/public/web.json';

// Define types based on the JSON Bible Format
interface BibleVerse {
  type: 'verse';
  bookName: string;
  chapterNumber: number;
  number: number;
  text: string;
}

interface BibleChapter {
  type: 'chapter';
  bookName: string;
  number: number;
}

interface BibleBook {
  type: 'book';
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

    for (const book of data.books) {
      // Add book header
      processedItems.push({ type: 'book', name: book.name });

      for (const chapter of book.chapters) {
        // Add chapter header
        processedItems.push({
          type: 'chapter',
          bookName: book.name,
          number: chapter.number,
        });

        // Add verses
        for (const verse of chapter.verses) {
          processedItems.push({
            type: 'verse',
            bookName: book.name,
            chapterNumber: chapter.number,
            number: verse.number,
            text: verse.text,
          });
        }
      }
    }

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
        contain: 'strict',
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
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
            const item = items[virtualRow.index];
            if (!item) {
              return null;
            }

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="p-2"
              >
                {item.type === 'book' && (
                  <h1 className="mt-6 mb-2 font-bold text-3xl">{item.name}</h1>
                )}
                {item.type === 'chapter' && (
                  <h2 className="mt-4 mb-1 font-semibold text-2xl">
                    Chapter {item.number}
                  </h2>
                )}
                {item.type === 'verse' && (
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
