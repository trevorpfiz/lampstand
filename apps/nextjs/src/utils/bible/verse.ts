export interface VerseReference {
  book: string;
  chapter: number;
  verse?: number;
}

// Maps a string like "Genesis 1:25" or "Genesis 1" or "Genesis" to a VerseReference
export function parseReference(ref: string): VerseReference | null {
  const parts = ref.trim().split(/\s+/);
  if (parts.length < 1) return null;

  const book = parts[0];
  let chapter: number | undefined;
  let verse: number | undefined;

  if (parts.length > 1) {
    const chapterPart = parts[1];
    if (!chapterPart) return null;

    const chVerse = chapterPart.split(":");
    const parsedChapter = parseInt(chVerse[0], 10);
    if (isNaN(parsedChapter)) return null;

    chapter = parsedChapter;
    if (chVerse.length > 1 && chVerse[1]) {
      const parsedVerse = parseInt(chVerse[1], 10);
      if (!isNaN(parsedVerse)) {
        verse = parsedVerse;
      }
    }
  }

  if (!chapter) {
    // Just a book reference, default to chapter 1
    return { book, chapter: 1 };
  }

  return { book, chapter, verse };
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
export function findChapterIndex(chapters: any[], ref: VerseReference): number {
  const idx = chapters.findIndex(
    (ch) =>
      ch.bookName.toLowerCase() === ref.book.toLowerCase() &&
      parseInt(ch.chapterNumber, 10) === ref.chapter,
  );
  return idx;
}
