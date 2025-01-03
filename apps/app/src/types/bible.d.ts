/**
 * The top-level "Root" is typically an object keyed by book code,
 * each containing a BookContent.
 */
export type Root = Record<string, BookContent>;

/**
 * A BookContent typically has this shape.
 * "type" might be "USJ",
 * "version" might be "3.1",
 * "content" is an array of nodes (para, chapter, etc.).
 */
export interface BookContent {
  type: string; // e.g., "USJ"
  version: string; // e.g., "3.1"
  content: ContentNode[];
}

/**
 * The "ContentNode" is the union for all sorts of lines:
 * "book", "para", "chapter", etc.
 */
export interface ContentNode {
  type: string; // e.g. "book", "para", "chapter", "note", "verse"
  marker?: string; // e.g., "h", "toc1", "c", "s1", etc.
  number?: string; // For chapters or verses (like "1" for chapter 1)
  sid?: string; // Some unique ID for verses or sections
  content?: (string | ContentNode)[]; // The node’s children
  caller?: string; // For footnotes, e.g. "+"
}

/**
 * ------------------------------------------------------------------
 * IR (Intermediate Representation) for the Bible after parsing USJ:
 * ------------------------------------------------------------------
 *
 * This is your "clean" structure that you pass to your UI components.
 */

/** The entire IR object: multiple books. */
export interface IR {
  books: IRBook[];
}

/** A single book in the IR. */
export interface IRBook {
  /** e.g., "GEN" or "Matthew" */
  code: string;
  /** e.g., "GENESIS" => data-reference ID for the entire book */
  bookId: string;
  /** The readable title (e.g., "Genesis") */
  title: string | null;
  chapters: IRChapter[];
}

/** A single chapter in the IR. */
export interface IRChapter {
  /** e.g. "GENESIS-1" => data-reference ID for entire chapter */
  chapterId: string;
  bookName: string; // e.g. "Genesis"
  number: number; // e.g. 1 for chapter 1
  elements: ChapterElement[];
}

/** Each “element” in a chapter could be a verse block, paragraph, heading, etc. */
export type ChapterElement =
  | VerseBlock
  | Paragraph
  | Heading
  | ReferenceLine
  | Blank
  | BookTitle;

/** A block of verses, either a fresh paragraph (`verse_block`) or continuing from a prior paragraph (`continued_verse_block`). */
export interface VerseBlock {
  type: 'verse_block' | 'continued_verse_block';
  style: string; // e.g. "p", "q1"
  verses: IRVerse[];
}

/** A single verse in the IR. */
export interface IRVerse {
  verseNumber: number;
  sid: string; // original USJ ID if needed
  verseId: string; // e.g., "GENESIS-1-1"
  parts: VersePart[];
}

/** A verse may contain multiple text segments, each possibly with footnotes. */
export interface VersePart {
  text: string;
  footnotes: Footnote[];
}

/** A single footnote. */
export interface Footnote {
  ref: string; // e.g. "1:1"
  text: string; // footnote text
  letter?: string; // letter label, e.g. "a", "b"
}

/** Paragraph without verses. */
export interface Paragraph {
  type: 'paragraph';
  style: string; // e.g. "m", "pmo", etc.
  text: string; // combined text
}

/** A heading, e.g. "s1" or "s2". */
export interface Heading {
  type: 'heading';
  level: string; // e.g., "s1", "s2", etc.
  text: string;
}

/** A reference line, e.g. "r". */
export interface ReferenceLine {
  type: 'reference_line';
  text: string;
}

/** Just a blank line, e.g. "b". */
export interface Blank {
  type: 'blank';
}

/** The "book_title" block for the first chapter. */
export interface BookTitle {
  type: 'book_title';
  text: string;
}
