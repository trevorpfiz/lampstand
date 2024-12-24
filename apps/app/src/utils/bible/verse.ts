interface BibleChapter {
  bookName: string;
  chapterNumber: string;
}

export interface VerseReference {
  book: string;
  chapter: number;
  verse?: number;
}

const VERSE_REFERENCE_REGEX = /^(\d*\s*[A-Za-z]+)\s+(\d+)(?::(\d+))?$/;

// Maps a string like "Genesis 1:25" or "Genesis 1" or "Genesis" to a VerseReference
export function parseReference(reference: string): VerseReference | null {
  const match = VERSE_REFERENCE_REGEX.exec(reference);

  if (!match?.[1] || !match[2]) {
    return null;
  }

  const [, bookPart, chapterPart, versePart] = match;

  // Properly capitalize book name
  const capitalizedBook = bookPart
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return {
    book: capitalizedBook,
    chapter: Number.parseInt(chapterPart, 10),
    verse: versePart ? Number.parseInt(versePart, 10) : undefined,
  };
}

// Convert a VerseReference to a string ID to attach to HTML elements.
// For example: {book:"Genesis", chapter:1, verse:25} => "GENESIS-1-25"
export function verseId(ref: VerseReference): string {
  const bookUpper = ref.book.toUpperCase();
  if (ref.verse !== undefined) {
    return `${bookUpper}-${ref.chapter}-${ref.verse}`;
  }
  return `${bookUpper}-${ref.chapter}`;
}

// Simple helper to find the chapter index in the chapters array
export function findChapterIndex(
  chapters: BibleChapter[],
  ref: VerseReference
): number {
  const idx = chapters.findIndex(
    (ch) =>
      ch.bookName.toLowerCase() === ref.book.toLowerCase() &&
      Number.parseInt(ch.chapterNumber, 10) === ref.chapter
  );
  return idx;
}
