// Types for USJ data
export type Root = Record<string, BookContent>;

export interface BookContent {
  type: string; // Example: "USJ"
  version: string; // Example: "3.1"
  content: ContentNode[];
}

export interface ContentNode {
  type: string; // "book", "para", "chapter", etc.
  marker?: string; // e.g., "id", "h", "c"
  number?: string; // For chapters and verses
  sid?: string; // Unique IDs for verses or sections
  content?: (string | ContentNode)[]; // Nested content
  caller?: string; // Used in notes, e.g., "+"
}

// Semantic structures
export interface ChapterSemanticData {
  bookCode: string;
  bookName: string;
  chapterNumber: string;
  verses: Record<number, Verse>;
  segments: SemanticSegment[];
}

export interface Verse {
  number: number;
  segments: VerseSegment[];
}

export interface VerseSegment {
  type: 'text' | 'footnote';
  content: string;
  letter?: string; // For footnotes
}

export type HeadingLevel = 'heading' | 'subheading';

export interface SemanticSegment {
  type: 'heading' | 'blank' | 'verseLine' | 'otherLine';
  headingLevel?: HeadingLevel;
  text?: string;
  verseNumber?: number;
  marker?: string; // Identifies style of the source line
}

// Formatted structures
export interface FormattedBlock {
  type: 'heading' | 'subheading' | 'paragraph' | 'poetry' | 'blank' | 'other';
  marker: string;
  verses: number[];
  lines?: string[];
}

export interface ChapterData {
  bookCode: string;
  bookName: string;
  chapterNumber: string;
  verses: Record<number, Verse>;
  formattedBlocks: FormattedBlock[];
}
