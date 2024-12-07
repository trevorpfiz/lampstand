"use client";

import { ReferenceSelect } from "~/components/bible/reference-select";
import { BibleSelect } from "./bible-select";

interface VerseNavigationBarProps {
  getChapterIndex: (book: string, chapter: number) => number;
  scrollToChapterAndVerse: (chapterIndex: number, verseId?: string) => void;
}

export function VerseNavigationBar({
  scrollToChapterAndVerse,
  getChapterIndex,
}: VerseNavigationBarProps) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-200 p-2">
      <BibleSelect />
      <ReferenceSelect
        getChapterIndex={getChapterIndex}
        scrollToChapterAndVerse={scrollToChapterAndVerse}
      />
    </div>
  );
}
