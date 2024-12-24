'use client';

import { BibleSelect } from '~/components/bible/bible-select';
import { ReferenceSelect } from '~/components/bible/reference-select';

interface VerseNavigationBarProps {
  getChapterIndex: (book: string, chapter: number) => number;
  scrollToChapterAndVerse: (chapterIndex: number, verseId?: string) => void;
}

export function VerseNavigationBar({
  scrollToChapterAndVerse,
  getChapterIndex,
}: VerseNavigationBarProps) {
  return (
    <div className="flex items-center gap-2 border-gray-200 border-b p-2">
      <div className="w-16">
        <BibleSelect />
      </div>
      <div className="w-full max-w-44">
        <ReferenceSelect
          getChapterIndex={getChapterIndex}
          scrollToChapterAndVerse={scrollToChapterAndVerse}
        />
      </div>
    </div>
  );
}
