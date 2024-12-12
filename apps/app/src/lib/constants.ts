import bibleMetadata from "~/public/bible_metadata.json";

export type BibleMetadata = {
  book: string;
  chapters: {
    chapter: number;
    verses: number;
  }[];
}[];

interface BibleVerseReference {
  value: string;
}

interface BibleBook {
  book: string;
  items: BibleVerseReference[];
}

export const BIBLE_VERSES: BibleBook[] = bibleMetadata.map((book) => ({
  book: book.book,
  items: book.chapters.flatMap((chapter) => {
    const chapterRef = `${book.book} ${chapter.chapter}`;
    const verses = Array.from({ length: chapter.verses }, (_, i) => ({
      value: `${book.book} ${chapter.chapter}:${i + 1}`,
    }));
    return [{ value: chapterRef }, ...verses];
  }),
}));

export const BIBLE_VERSESS: BibleVerseReference[] = bibleMetadata.flatMap(
  (book) =>
    book.chapters.flatMap((chapter) => {
      const chapterRef = `${book.book} ${chapter.chapter}`;
      const verses = Array.from({ length: chapter.verses }, (_, i) => ({
        value: `${book.book} ${chapter.chapter}:${i + 1}`,
      }));
      return [{ value: chapterRef }, ...verses];
    }),
);

export const BIBLE_VERSIONS = [
  { value: "BSB", label: "BSB", disabled: false },
  { value: "KJV", label: "KJV (Coming Soon)", disabled: true },
] as const;

export const BIBLE_BOOKS = [
  {
    category: "Law",
    items: [
      { value: "Genesis", label: "Genesis" },
      { value: "Exodus", label: "Exodus" },
      { value: "Leviticus", label: "Leviticus" },
      { value: "Numbers", label: "Numbers" },
      { value: "Deuteronomy", label: "Deuteronomy" },
    ],
  },
  {
    category: "History",
    items: [
      { value: "Joshua", label: "Joshua" },
      { value: "Judges", label: "Judges" },
      { value: "Ruth", label: "Ruth" },
      { value: "1 Samuel", label: "1 Samuel" },
      { value: "2 Samuel", label: "2 Samuel" },
      { value: "1 Kings", label: "1 Kings" },
      { value: "2 Kings", label: "2 Kings" },
      { value: "1 Chronicles", label: "1 Chronicles" },
      { value: "2 Chronicles", label: "2 Chronicles" },
      { value: "Ezra", label: "Ezra" },
      { value: "Nehemiah", label: "Nehemiah" },
      { value: "Esther", label: "Esther" },
    ],
  },
  {
    category: "Poetry",
    items: [
      { value: "Job", label: "Job" },
      { value: "Psalms", label: "Psalms" },
      { value: "Proverbs", label: "Proverbs" },
      { value: "Ecclesiastes", label: "Ecclesiastes" },
      { value: "Song of Solomon", label: "Song of Solomon" },
    ],
  },
  {
    category: "Major Prophets",
    items: [
      { value: "Isaiah", label: "Isaiah" },
      { value: "Jeremiah", label: "Jeremiah" },
      { value: "Lamentations", label: "Lamentations" },
      { value: "Ezekiel", label: "Ezekiel" },
      { value: "Daniel", label: "Daniel" },
    ],
  },
  {
    category: "Minor Prophets",
    items: [
      { value: "Hosea", label: "Hosea" },
      { value: "Joel", label: "Joel" },
      { value: "Amos", label: "Amos" },
      { value: "Obadiah", label: "Obadiah" },
      { value: "Jonah", label: "Jonah" },
      { value: "Micah", label: "Micah" },
      { value: "Nahum", label: "Nahum" },
      { value: "Habakkuk", label: "Habakkuk" },
      { value: "Zephaniah", label: "Zephaniah" },
      { value: "Haggai", label: "Haggai" },
      { value: "Zechariah", label: "Zechariah" },
      { value: "Malachi", label: "Malachi" },
    ],
  },
  {
    category: "New Testament",
    items: [
      { value: "Matthew", label: "Matthew" },
      { value: "Mark", label: "Mark" },
      { value: "Luke", label: "Luke" },
      { value: "John", label: "John" },
      { value: "Acts", label: "Acts" },
      { value: "Romans", label: "Romans" },
      { value: "1 Corinthians", label: "1 Corinthians" },
      { value: "2 Corinthians", label: "2 Corinthians" },
      { value: "Galatians", label: "Galatians" },
      { value: "Ephesians", label: "Ephesians" },
      { value: "Philippians", label: "Philippians" },
      { value: "Colossians", label: "Colossians" },
      { value: "1 Thessalonians", label: "1 Thessalonians" },
      { value: "2 Thessalonians", label: "2 Thessalonians" },
      { value: "1 Timothy", label: "1 Timothy" },
      { value: "2 Timothy", label: "2 Timothy" },
      { value: "Titus", label: "Titus" },
      { value: "Philemon", label: "Philemon" },
      { value: "Hebrews", label: "Hebrews" },
      { value: "James", label: "James" },
      { value: "1 Peter", label: "1 Peter" },
      { value: "2 Peter", label: "2 Peter" },
      { value: "1 John", label: "1 John" },
      { value: "2 John", label: "2 John" },
      { value: "3 John", label: "3 John" },
      { value: "Jude", label: "Jude" },
      { value: "Revelation", label: "Revelation" },
    ],
  },
] as const;
