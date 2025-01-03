export const DEFAULT_BIBLE_REGEX = new RegExp(
  [
    '\\b(?:[1-3]\\s)?', // Optional leading "1 ", "2 ", or "3 "
    '[A-Z][a-zA-Z]+', // First word: capital letter + letters (e.g. "Matthew")
    '(?:\\s(?:of|the)?\\s[A-Z][a-zA-Z]+)*', // Additional words, optionally preceded by "of" or "the" (e.g. "of Solomon")
    '\\s+', // Require at least one space before chapter
    '\\d+', // Chapter number (e.g. "17")
    '(?::\\d+(?:-\\d+)?)?', // Optional :verse (or range), e.g. ":20" or ":20-21"
    '\\b', // Word boundary
  ].join(''), // Join parts into a single string
  'g' // Global flag
);

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
