import { getCodeFromName } from './constants';

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

const REF_PARSE_REGEX = new RegExp(
  '^' +
    '((?:[1-3]\\s)?[A-Z][a-zA-Z]+(?:\\s(?:of|the)?\\s[A-Z][a-zA-Z]+)*)' + // Group 1: multi-word book name
    '\\s+' + // At least one space
    '(\\d+)' + // Group 2: chapter
    '(?::(\\d+(?:-\\d+)?))?' + // Group 3: optional verse or verse-range
    '$'
);
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

export function parseReadableReference(
  userString: string
): ReferenceData | null {
  // 1) Try the new multi-word reference pattern
  const match = REF_PARSE_REGEX.exec(userString.trim());
  if (match) {
    // e.g. match = [ '2 Corinthians 5:7', '2 Corinthians', '5', '7' ]
    const [, bookStr, chapterStr, verseRangeStr] = match;

    // 2) Convert "2 Corinthians" => "2CO" (if it exists in your map):
    const code = getCodeFromName(bookStr);
    if (!code) return null;

    // 3) Parse chapter as integer
    const chapterNum = Number.parseInt(chapterStr, 10);
    if (Number.isNaN(chapterNum)) return { book: code };

    // 4) If verse is provided, parse up to any dash
    if (verseRangeStr) {
      // e.g. "8" or "8-9"
      const [startVerseStr] = verseRangeStr.split('-');
      const verseNum = Number.parseInt(startVerseStr, 10);
      if (!Number.isNaN(verseNum)) {
        return { book: code, chapter: chapterNum, verse: verseNum };
      }
    }

    // If no verse, just return book+chapter
    return { book: code, chapter: chapterNum };
  }

  // 5) If that fails, maybe it was a single word for the book only:
  //    e.g. "Genesis"
  const words = userString.trim().split(SINGLE_WORD_REGEX);
  if (words.length === 1) {
    const code = getCodeFromName(words[0]);
    return code ? { book: code } : null;
  }

  // 6) Otherwise, not parseable
  return null;
}
