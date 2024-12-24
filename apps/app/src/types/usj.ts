export interface SemanticOutput {
  book: string | null;
  chapters: ChapterSemanticData[];
}

export interface ChapterSemanticData {
  number: number;
  verses: Record<string, VerseData>;
  formattedBlocks: FormattedBlock[];
}

export interface VerseData {
  number: string;
  segments: VerseSegment[]; // text segments and footnotes
}

export type VerseSegment =
  | { type: 'text'; content: string }
  | { type: 'footnote'; ref: string | null; content: string | null };

export type FormattedBlock =
  | HeadingBlock
  | ParagraphBlock
  | BlankBlock
  | ReferenceBlock;

export interface HeadingBlock {
  type: 'heading' | 'subheading';
  level: number;
  lines: string[];
}

export interface ParagraphBlock {
  type: 'paragraph' | 'poetry' | 'other';
  marker?: string;
  // Lines that have no verse may just be in `lines`
  // Verses references: store verse numbers to map back to chapter.verses
  verses: string[];
  lines: string[];
}

export interface BlankBlock {
  type: 'blank';
}

export interface ReferenceBlock {
  type: 'reference';
  text: string;
}

// USJ interfaces (from your code)
export type USJData = Record<
  string,
  {
    type: string;
    version: string;
    content: USJContent[];
  }
>;

export interface USJContent {
  type: string;
  marker?: string;
  content?: (string | USJVerse | USJNote)[];
  number?: string;
  sid?: string;
}
export interface USJVerse {
  type: 'verse';
  marker: 'v';
  number: string;
  sid: string;
}
export interface USJNote {
  type: 'note';
  marker: 'f';
  content: (string | USJChar)[];
  caller: string;
}
export interface USJChar {
  type: 'char';
  marker: string;
  content: string[];
}
