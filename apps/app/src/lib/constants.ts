import { makeReferenceId } from '~/utils/bible/reference';

import bibleMetadata from '~/public/bible_metadata.json';

export const BIBLE_VERSIONS = [
  { value: 'BSB', label: 'BSB', disabled: false },
  { value: 'KJV', label: 'KJV (Coming Soon)', disabled: true },
] as const;

export const BIBLE_BOOKS = [
  {
    category: 'Law',
    items: [
      { value: 'Genesis', label: 'Genesis' },
      { value: 'Exodus', label: 'Exodus' },
      { value: 'Leviticus', label: 'Leviticus' },
      { value: 'Numbers', label: 'Numbers' },
      { value: 'Deuteronomy', label: 'Deuteronomy' },
    ],
  },
  {
    category: 'History',
    items: [
      { value: 'Joshua', label: 'Joshua' },
      { value: 'Judges', label: 'Judges' },
      { value: 'Ruth', label: 'Ruth' },
      { value: '1 Samuel', label: '1 Samuel' },
      { value: '2 Samuel', label: '2 Samuel' },
      { value: '1 Kings', label: '1 Kings' },
      { value: '2 Kings', label: '2 Kings' },
      { value: '1 Chronicles', label: '1 Chronicles' },
      { value: '2 Chronicles', label: '2 Chronicles' },
      { value: 'Ezra', label: 'Ezra' },
      { value: 'Nehemiah', label: 'Nehemiah' },
      { value: 'Esther', label: 'Esther' },
    ],
  },
  {
    category: 'Poetry',
    items: [
      { value: 'Job', label: 'Job' },
      { value: 'Psalms', label: 'Psalms' },
      { value: 'Proverbs', label: 'Proverbs' },
      { value: 'Ecclesiastes', label: 'Ecclesiastes' },
      { value: 'Song of Solomon', label: 'Song of Solomon' },
    ],
  },
  {
    category: 'Major Prophets',
    items: [
      { value: 'Isaiah', label: 'Isaiah' },
      { value: 'Jeremiah', label: 'Jeremiah' },
      { value: 'Lamentations', label: 'Lamentations' },
      { value: 'Ezekiel', label: 'Ezekiel' },
      { value: 'Daniel', label: 'Daniel' },
    ],
  },
  {
    category: 'Minor Prophets',
    items: [
      { value: 'Hosea', label: 'Hosea' },
      { value: 'Joel', label: 'Joel' },
      { value: 'Amos', label: 'Amos' },
      { value: 'Obadiah', label: 'Obadiah' },
      { value: 'Jonah', label: 'Jonah' },
      { value: 'Micah', label: 'Micah' },
      { value: 'Nahum', label: 'Nahum' },
      { value: 'Habakkuk', label: 'Habakkuk' },
      { value: 'Zephaniah', label: 'Zephaniah' },
      { value: 'Haggai', label: 'Haggai' },
      { value: 'Zechariah', label: 'Zechariah' },
      { value: 'Malachi', label: 'Malachi' },
    ],
  },
  {
    category: 'New Testament',
    items: [
      { value: 'Matthew', label: 'Matthew' },
      { value: 'Mark', label: 'Mark' },
      { value: 'Luke', label: 'Luke' },
      { value: 'John', label: 'John' },
      { value: 'Acts', label: 'Acts' },
      { value: 'Romans', label: 'Romans' },
      { value: '1 Corinthians', label: '1 Corinthians' },
      { value: '2 Corinthians', label: '2 Corinthians' },
      { value: 'Galatians', label: 'Galatians' },
      { value: 'Ephesians', label: 'Ephesians' },
      { value: 'Philippians', label: 'Philippians' },
      { value: 'Colossians', label: 'Colossians' },
      { value: '1 Thessalonians', label: '1 Thessalonians' },
      { value: '2 Thessalonians', label: '2 Thessalonians' },
      { value: '1 Timothy', label: '1 Timothy' },
      { value: '2 Timothy', label: '2 Timothy' },
      { value: 'Titus', label: 'Titus' },
      { value: 'Philemon', label: 'Philemon' },
      { value: 'Hebrews', label: 'Hebrews' },
      { value: 'James', label: 'James' },
      { value: '1 Peter', label: '1 Peter' },
      { value: '2 Peter', label: '2 Peter' },
      { value: '1 John', label: '1 John' },
      { value: '2 John', label: '2 John' },
      { value: '3 John', label: '3 John' },
      { value: 'Jude', label: 'Jude' },
      { value: 'Revelation', label: 'Revelation' },
    ],
  },
] as const;

/**
 * Map of 3-letter book codes to their full display names
 * Derived from CANONICAL_ORDER where each entry is like "01GENBSB"
 */
export const BIBLE_BOOK_CODES: Record<string, string> = {
  // Torah (Pentateuch)
  GEN: 'Genesis',
  EXO: 'Exodus',
  LEV: 'Leviticus',
  NUM: 'Numbers',
  DEU: 'Deuteronomy',
  // Historical Books
  JOS: 'Joshua',
  JDG: 'Judges',
  RUT: 'Ruth',
  '1SA': '1 Samuel',
  '2SA': '2 Samuel',
  '1KI': '1 Kings',
  '2KI': '2 Kings',
  '1CH': '1 Chronicles',
  '2CH': '2 Chronicles',
  EZR: 'Ezra',
  NEH: 'Nehemiah',
  EST: 'Esther',
  // Wisdom Literature
  JOB: 'Job',
  PSA: 'Psalms',
  PRO: 'Proverbs',
  ECC: 'Ecclesiastes',
  SNG: 'Song of Solomon',
  // Major Prophets
  ISA: 'Isaiah',
  JER: 'Jeremiah',
  LAM: 'Lamentations',
  EZK: 'Ezekiel',
  DAN: 'Daniel',
  // Minor Prophets
  HOS: 'Hosea',
  JOL: 'Joel',
  AMO: 'Amos',
  OBA: 'Obadiah',
  JON: 'Jonah',
  MIC: 'Micah',
  NAM: 'Nahum',
  HAB: 'Habakkuk',
  ZEP: 'Zephaniah',
  HAG: 'Haggai',
  ZEC: 'Zechariah',
  MAL: 'Malachi',
  // New Testament
  MAT: 'Matthew',
  MRK: 'Mark',
  LUK: 'Luke',
  JHN: 'John',
  ACT: 'Acts',
  ROM: 'Romans',
  '1CO': '1 Corinthians',
  '2CO': '2 Corinthians',
  GAL: 'Galatians',
  EPH: 'Ephesians',
  PHP: 'Philippians',
  COL: 'Colossians',
  '1TH': '1 Thessalonians',
  '2TH': '2 Thessalonians',
  '1TI': '1 Timothy',
  '2TI': '2 Timothy',
  TIT: 'Titus',
  PHM: 'Philemon',
  HEB: 'Hebrews',
  JAS: 'James',
  '1PE': '1 Peter',
  '2PE': '2 Peter',
  '1JN': '1 John',
  '2JN': '2 John',
  '3JN': '3 John',
  JUD: 'Jude',
  REV: 'Revelation',
};

/**
 * Helper function to get the 3-letter code from a CANONICAL_ORDER entry
 * e.g. "01GENBSB" => "GEN"
 */
export function getBookCode(canonicalEntry: string): string {
  return canonicalEntry.slice(2, 5);
}

/**
 * Helper function to get the full name of a book from its code
 * e.g. "GEN" => "Genesis"
 */
export function getBookName(code: string): string {
  return BIBLE_BOOK_CODES[code] || code;
}

/**
 * Helper function to get the book code from a full name
 * e.g. "Genesis" => "GEN"
 */
export function getCodeFromName(name: string): string | null {
  const normalizedName = name.toLowerCase();
  const entry = Object.entries(BIBLE_BOOK_CODES).find(
    ([_, bookName]) => bookName.toLowerCase() === normalizedName
  );
  return entry ? entry[0] : null;
}

/**
 * The shape of your bible_metadata.json
 */
export type BibleMetadata = {
  book: string; // e.g. "Genesis"
  chapters: {
    chapter: number; // e.g. 1
    verses: number; // e.g. 31
  }[];
}[];

interface BibleVerseReference {
  value: string; // e.g. "GEN-1-1"
}

interface BibleBook {
  book: string;
  items: BibleVerseReference[];
}

/**
 * A structure that includes the book-level ID,
 * all chapter-level IDs, and all verse-level IDs:
 *   "GEN" => "GEN-1" => "GEN-1-1", etc.
 */
export const BIBLE_VERSES: BibleBook[] = bibleMetadata.map((bm) => {
  // Map "Genesis" => "GEN" (returns null if not found)
  const code = getCodeFromName(bm.book) ?? bm.book;
  // Book-level reference => "GEN"
  const bookId = makeReferenceId({ book: code });

  // Chapter+verse references
  const chaptersWithVerses = bm.chapters.flatMap((ch) => {
    const chapterId = makeReferenceId({ book: code, chapter: ch.chapter });

    const verseRefs = Array.from({ length: ch.verses }, (_, i) => {
      const verseNum = i + 1;
      return {
        value: makeReferenceId({
          book: code,
          chapter: ch.chapter,
          verse: verseNum,
        }),
      };
    });

    // Return [chapter-level, all verse-level]
    return [{ value: chapterId }, ...verseRefs];
  });

  return {
    book: bm.book, // spelled-out, e.g. "Genesis"
    items: [{ value: bookId }, ...chaptersWithVerses],
  };
});

/**
 * A simpler flat list, without grouping by book. Just references.
 * Example item: { value: "GEN-1-1" }
 */
export const BIBLE_VERSE_REFERENCES: BibleVerseReference[] =
  bibleMetadata.flatMap((bm) => {
    const code = getCodeFromName(bm.book) ?? bm.book;
    const bookId = makeReferenceId({ book: code });

    const chapterPlusVerses = bm.chapters.flatMap((ch) => {
      const chapterId = makeReferenceId({ book: code, chapter: ch.chapter });

      const verseIds = Array.from({ length: ch.verses }, (_, i) => ({
        value: makeReferenceId({
          book: code,
          chapter: ch.chapter,
          verse: i + 1,
        }),
      }));

      return [{ value: chapterId }, ...verseIds];
    });
    return [{ value: bookId }, ...chapterPlusVerses];
  });
