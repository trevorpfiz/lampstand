interface BibleChapter {
  bookName: string;
  chapterNumber: string;
}

export interface VerseReference {
  book: string;
  chapter: number;
  verse?: number;
}

// Maps a string like "Genesis 1:25" or "Genesis 1" or "Genesis" to a VerseReference
export function parseReference(reference: string): VerseReference | null {
  // Handle book names with spaces (e.g. "1 Samuel", "2 Kings")
  const regex = /^(\d*\s*[A-Za-z]+)\s+(\d+)(?::(\d+))?$/;
  const match = regex.exec(reference);

  if (!match?.[1] || !match[2]) {
    console.log("Reference failed to match regex:", reference);
    return null;
  }

  const [, bookPart, chapterPart, versePart] = match;

  // Properly capitalize book name
  const capitalizedBook = bookPart
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  // Log the parsed components
  console.log("Parsed components:", {
    book: capitalizedBook,
    chapter: chapterPart,
    verse: versePart,
  });

  return {
    book: capitalizedBook,
    chapter: parseInt(chapterPart, 10),
    verse: versePart ? parseInt(versePart, 10) : undefined,
  };
}

// Convert a VerseReference to a string ID to attach to HTML elements.
// For example: {book:"Genesis", chapter:1, verse:25} => "GENESIS-1-25"
export function verseId(ref: VerseReference): string {
  const bookUpper = ref.book.toUpperCase();
  if (ref.verse !== undefined) {
    return `${bookUpper}-${ref.chapter}-${ref.verse}`;
  } else {
    return `${bookUpper}-${ref.chapter}`;
  }
}

// Simple helper to find the chapter index in the chapters array
export function findChapterIndex(
  chapters: BibleChapter[],
  ref: VerseReference,
): number {
  const idx = chapters.findIndex(
    (ch) =>
      ch.bookName.toLowerCase() === ref.book.toLowerCase() &&
      parseInt(ch.chapterNumber, 10) === ref.chapter,
  );
  return idx;
}
