import type { NoteNode, ParaNode, Root, VerseNode } from '~/types/bible';
import type {
  Blank,
  BookTitle,
  ChapterElement,
  Heading,
  IR,
  IRBook,
  IRChapter,
  Paragraph,
  ReferenceLine,
} from '~/utils/bible/formatting-assembly';
import { verseId } from '~/utils/bible/verse';

interface USJVerse {
  type: 'verse';
  number: string;
  sid: string;
}

interface USJCharNode {
  type: 'char';
  marker: string;
  content: string[];
}

interface USJNote {
  type: 'note';
  // Note content can be either strings or char objects
  content: (string | USJCharNode)[];
}

// Extend IRBook to add code & title
interface CurrentBook extends IRBook {
  code: string;
  title: string | null;
  chapters: IRChapter[];
}

// Extend IRChapter to ensure number and elements are defined
interface CurrentChapter extends IRChapter {
  bookName: string;
  number: number;
  elements: ChapterElement[];
}

interface CurrentVerse {
  verseNumber: number;
  sid: string;
  verseId: string;
  parts: {
    text: string;
    footnotes: {
      ref: string;
      text: string;
      letter?: string;
    }[];
  }[];
}

interface VerseBlock {
  type: 'verse_block' | 'continued_verse_block';
  style: string;
  verses: CurrentVerse[];
}

export function parseUSJToIR(usjData: Root): IR {
  const ir: IR = { books: [] };

  let currentBook: CurrentBook | null = null;
  let currentChapter: CurrentChapter | null = null;
  let currentVerse: CurrentVerse | null = null;
  let currentVerseBlock: VerseBlock | null = null;
  let textBuffer = '';

  let verseContinuing = false;
  let currentVerseNumber: number | null = null;
  let currentVerseSid: string | null = null;

  let footnoteIndex = 0;

  function startBook(code: string): void {
    currentBook = {
      code,
      title: null,
      chapters: [],
    };
    ir.books.push(currentBook);
  }

  function startChapter(number: string): void {
    finalizeOpenVerseAndBlock();
    verseContinuing = false;
    currentVerseNumber = null;
    currentVerseSid = null;
    footnoteIndex = 0;

    if (!currentBook) {
      return;
    }

    currentChapter = {
      bookName: currentBook.title ?? currentBook.code,
      number: Number.parseInt(number, 10),
      elements: [],
    };
    currentBook.chapters.push(currentChapter);

    if (Number.parseInt(number, 10) === 1) {
      const bookTitle = currentBook.title ?? currentBook.code;
      currentChapter.elements.push({
        type: 'book_title',
        text: bookTitle,
      } as BookTitle);
    }
  }

  function addHeading(text: string, level: string): void {
    if (!currentChapter) {
      return;
    }
    finalizeOpenVerseAndBlock();
    verseContinuing = false;
    currentVerseNumber = null;
    currentVerseSid = null;

    const heading: Heading = {
      type: 'heading',
      level,
      text: text.trim(),
    };
    currentChapter.elements.push(heading);
  }

  function addReferenceLine(text: string): void {
    if (!currentChapter) {
      return;
    }
    finalizeOpenVerseAndBlock();
    verseContinuing = false;
    currentVerseNumber = null;
    currentVerseSid = null;

    const refLine: ReferenceLine = {
      type: 'reference_line',
      text: text.trim(),
    };
    currentChapter.elements.push(refLine);
  }

  function addBlank(): void {
    if (!currentChapter) {
      return;
    }
    finalizeOpenVerseAndBlock();
    const blank: Blank = { type: 'blank' };
    currentChapter.elements.push(blank);
  }

  function finalizeOpenVerseAndBlock(): void {
    if (currentVerse) {
      finalizePartIfNeeded();
      if (currentVerseBlock) {
        currentVerseBlock.verses.push(currentVerse);
      }
      currentVerse = null;
      textBuffer = '';
    }

    if (currentVerseBlock) {
      if (currentVerseBlock.verses.length > 0 && currentChapter) {
        currentChapter.elements.push(currentVerseBlock);
      }
      currentVerseBlock = null;
    }
  }

  function finalizePartIfNeeded(): void {
    if (!currentVerse) {
      return;
    }
    if (textBuffer.length > 0) {
      currentVerse.parts.push({
        text: textBuffer,
        footnotes: [],
      });
      textBuffer = '';
    }
  }

  function startVerseBlock(style: string): void {
    finalizeOpenVerseAndBlock();
    currentVerseBlock = { type: 'verse_block', style, verses: [] };
  }

  function startContinuedVerseBlock(style: string): void {
    finalizeOpenVerseAndBlock();
    currentVerseBlock = { type: 'continued_verse_block', style, verses: [] };
  }

  function startVerse(number: string, sid: string): void {
    if (!currentBook || !currentChapter || !currentVerseBlock) {
      return;
    }

    if (
      currentVerse &&
      currentVerse.verseNumber !== Number.parseInt(number, 10)
    ) {
      finalizePartIfNeeded();
      currentVerseBlock.verses.push(currentVerse);
      currentVerse = null;
      textBuffer = '';
    }

    const verseNum = Number.parseInt(number, 10);
    const bookName = currentBook.title ?? currentBook.code;
    const ref = {
      book: bookName,
      chapter: currentChapter.number,
      verse: verseNum,
    };
    const vId = verseId(ref);

    currentVerse = {
      verseNumber: verseNum,
      sid,
      verseId: vId,
      parts: [],
    };
    verseContinuing = true;
    currentVerseNumber = verseNum;
    currentVerseSid = sid;
  }

  function attachFootnote(noteObj: USJNote): void {
    if (!currentVerse) {
      return;
    }

    const extractedFootnotes = extractFootnoteText(noteObj);
    for (const fn of extractedFootnotes) {
      fn.letter = String.fromCharCode(97 + footnoteIndex);
      footnoteIndex++;
    }

    textBuffer = textBuffer.trimEnd();

    currentVerse.parts.push({
      text: textBuffer,
      footnotes: extractedFootnotes,
    });

    textBuffer = '';
  }

  function handleVerseContent(
    contentArray: (string | VerseNode | NoteNode)[]
  ): void {
    for (const item of contentArray) {
      if (typeof item === 'string') {
        textBuffer += item;
      } else if (item.type === 'verse') {
        startVerse(item.number, item.sid);
      } else if (item.type === 'note') {
        attachFootnote(item as USJNote);
      }
    }
  }

  function extractFootnoteText(
    noteObj: USJNote
  ): { ref: string; text: string }[] {
    let ref = '';
    let text = '';
    for (const c of noteObj.content) {
      if (typeof c === 'string') {
        text += c;
      } else if (c.type === 'char') {
        if (c.marker === 'fr') {
          ref += c.content.join('');
        } else if (c.marker === 'ft') {
          text += c.content.join('');
        }
      }
    }
    return [{ ref: ref.trim(), text: text.trim() }];
  }

  function handleParagraphNode(node: ParaNode): void {
    if (
      !currentBook ||
      (!currentChapter &&
        node.marker !== 'h' &&
        node.marker !== 'toc1' &&
        node.marker !== 'mt1')
    ) {
      return;
    }

    const marker = node.marker;
    const rawContent = node.content || [];
    const rawText = rawContent
      .map((c) => (typeof c === 'string' ? c : ''))
      .join('');
    const text = rawText.trim();

    const hasVerse = node.content?.some(
      (x) => typeof x === 'object' && x !== null && x.type === 'verse'
    );

    if (marker === 'h' || marker === 'toc1' || marker === 'mt1') {
      if (!currentBook.title && text) {
        currentBook.title = text;
      }
    } else if (marker === 'c') {
      startChapter(node.number);
    } else if (marker.startsWith('s')) {
      addHeading(text, marker);
    } else if (marker === 'r') {
      addReferenceLine(text);
    } else if (marker === 'b') {
      addBlank();
    } else {
      // Paragraph may or may not have verses
      if (hasVerse) {
        startVerseBlock(marker);
        handleVerseContent(node.content as (string | VerseNode | NoteNode)[]);
        finalizePartIfNeeded();
        finalizeOpenVerseAndBlock();
      } else {
        // No verse marker here
        if (
          verseContinuing &&
          currentVerseNumber !== null &&
          currentVerseSid !== null
        ) {
          startContinuedVerseBlock(marker);
          currentVerse = {
            verseNumber: currentVerseNumber,
            sid: currentVerseSid,
            verseId: verseId({
              book: currentBook.title ?? currentBook.code,
              chapter: currentChapter.number,
              verse: currentVerseNumber,
            }),
            parts: [],
          };

          for (const item of node.content) {
            if (typeof item === 'string') {
              textBuffer += item;
            } else if (item.type === 'note') {
              attachFootnote(item as USJNote);
            }
          }

          finalizePartIfNeeded();
          if (currentVerseBlock && currentVerse) {
            currentVerseBlock.verses.push(currentVerse);
          }
          currentVerse = null;
          finalizeOpenVerseAndBlock();
        } else {
          // Normal paragraph, not continuing a verse
          finalizeOpenVerseAndBlock();
          verseContinuing = false;
          currentVerseNumber = null;
          currentVerseSid = null;

          if (text) {
            const paragraph: Paragraph = {
              type: 'paragraph',
              style: marker,
              text: rawText,
            };
            currentChapter.elements.push(paragraph);
          } else if (rawText === '') {
            addBlank();
          } else {
            const paragraph: Paragraph = {
              type: 'paragraph',
              style: marker,
              text: rawText,
            };
            currentChapter.elements.push(paragraph);
          }
        }
      }
    }
  }

  const bookKeys = Object.keys(usjData);
  for (const bkKey of bookKeys) {
    const bookData = usjData[bkKey];
    if (!bookData || bookData.type !== 'USJ') {
      continue;
    }

    const content = bookData.content;
    if (!content) {
      continue;
    }

    for (const node of content) {
      if (node.type === 'book' && 'code' in node) {
        startBook(node.code);
      } else if (node.type === 'para') {
        handleParagraphNode(node);
      } else if (node.type === 'chapter' && 'number' in node) {
        startChapter(node.number);
      }
    }
  }

  finalizeOpenVerseAndBlock();
  return ir;
}
