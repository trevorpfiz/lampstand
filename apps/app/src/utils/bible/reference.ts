import { getBookName, getCodeFromName } from '~/lib/constants';

export interface BibleChapter {
  bookName: string;
  chapterNumber: string;
}

/**
 * A general reference object.
 * If `chapter` is undefined, it's just a book-level reference.
 * If `verse` is also set, it's a verse-level reference.
 */
export interface ReferenceData {
  book: string; // e.g. "GEN" (3-letter code)
  chapter?: number; // e.g. 1
  verse?: number; // e.g. 1
}

// Regexes for parsing "Book Chapter:Verse" from the user
const READABLE_REFERENCE_REGEX = /^(\S+)\s+(\d+)(?::(\d+))?$/;
const SINGLE_WORD_REGEX = /\s+/;

/**
 * Returns a string like:
 *  - BOOK                    => "GEN"
 *  - BOOK + CHAPTER         => "GEN-1"
 *  - BOOK + CHAPTER + VERSE => "GEN-1-1"
 */
export function makeReferenceId(ref: ReferenceData): string {
  if (ref.chapter == null) {
    return ref.book; // e.g. "GEN"
  }
  if (ref.verse == null) {
    return `${ref.book}-${ref.chapter}`; // e.g. "GEN-1"
  }
  return `${ref.book}-${ref.chapter}-${ref.verse}`; // e.g. "GEN-1-1"
}

/**
 * Attempt to parse an ID like "GEN-1-1", "GEN-1", or "GEN".
 * Returns { book, chapter?: number, verse?: number } or null if invalid.
 */
export function parseReferenceId(str: string): ReferenceData | null {
  const parts = str.split('-');
  if (parts.length === 1) {
    // e.g. "GEN"
    return { book: parts[0] || '' };
  }
  if (parts.length === 2) {
    // e.g. "GEN-1"
    const [book, chapStr = ''] = parts;
    const chapter = Number.parseInt(chapStr, 10);
    if (Number.isNaN(chapter)) {
      return null;
    }
    return { book: book || '', chapter };
  }
  if (parts.length === 3) {
    // e.g. "GEN-1-1"
    const [book, chapStr = '', verseStr = ''] = parts;
    const chapter = Number.parseInt(chapStr, 10);
    const verse = Number.parseInt(verseStr, 10);
    if (Number.isNaN(chapter) || Number.isNaN(verse)) {
      return null;
    }
    return { book: book || '', chapter, verse };
  }
  return null;
}

/**
 * If the user typed "John 3:16", parse it as { book: "JHN", chapter: 3, verse: 16 }.
 * If "John 3", parse as { book: "JHN", chapter: 3 }.
 * If just one word "John", parse as { book: "JHN" }.
 */
export function parseReadableReference(
  userString: string
): ReferenceData | null {
  const match = userString.match(READABLE_REFERENCE_REGEX);
  if (!match) {
    // Maybe it is just a single word for the book:
    // e.g. "Genesis"
    if (userString.trim().split(SINGLE_WORD_REGEX).length === 1) {
      const code = getCodeFromName(userString.trim());
      return code ? { book: code } : null;
    }
    return null;
  }

  const [_, book, cStr, vStr] = match;
  if (!book) {
    return null;
  }

  const code = getCodeFromName(book);
  if (!code) {
    return null;
  }

  if (!cStr) {
    // Just the book
    return { book: code };
  }
  if (!vStr) {
    return { book: code, chapter: Number(cStr) };
  }
  return { book: code, chapter: Number(cStr), verse: Number(vStr) };
}

/**
 * Find the chapter index in a list of chapters.
 * Returns -1 if not found.
 */
export function findChapterIndex(
  chapters: BibleChapter[],
  ref: ReferenceData
): number {
  const bookName = getBookName(ref.book);
  return chapters.findIndex(
    (ch) =>
      ch.bookName.toLowerCase() === bookName.toLowerCase() &&
      Number.parseInt(ch.chapterNumber, 10) === ref.chapter
  );
}

/**
 * Formats a reference into a display string.
 * Examples:
 * - { book: "GEN" } => "Genesis"
 * - { book: "GEN", chapter: 1 } => "Genesis 1"
 * - { book: "GEN", chapter: 1, verse: 1 } => "Genesis 1:1"
 */
export function formatReference(ref: ReferenceData): string {
  const bookName = getBookName(ref.book);
  if (!ref.chapter) {
    return bookName;
  }
  if (!ref.verse) {
    return `${bookName} ${ref.chapter}`;
  }
  return `${bookName} ${ref.chapter}:${ref.verse}`;
}

/**
 * Formats a reference range for copying.
 * If start and end are the same, returns a single reference.
 * Examples:
 * - "Genesis 1:1"
 * - "Genesis 1:1-3"
 * - "Genesis 1:1-2:3" (same book, different chapters)
 * - "Genesis 1:1 - Exodus 2:3" (different books)
 */
export function formatReferenceForCopy(
  start: ReferenceData,
  end?: ReferenceData
): string {
  if (
    !end ||
    (start.book === end.book &&
      start.chapter === end.chapter &&
      start.verse === end.verse)
  ) {
    return formatReference(start);
  }

  // Same book and chapter
  if (start.book === end.book && start.chapter === end.chapter) {
    return `${getBookName(start.book)} ${start.chapter}:${start.verse}-${end.verse}`;
  }

  // Same book, different chapters
  if (start.book === end.book) {
    return `${getBookName(start.book)} ${start.chapter}:${start.verse}-${end.chapter}:${end.verse}`;
  }

  // Different books
  return `${formatReference(start)}-${formatReference(end)}`;
}
