/* ---------------------------------------------------------------------------
 * parseUSJToIR.ts
 * --------------------------------------------------------------------------- */

import type {
  Blank,
  BookTitle,
  ContentNode,
  Heading,
  IR,
  IRBook,
  IRChapter,
  IRVerse,
  Paragraph,
  ReferenceLine,
  Root,
  VerseBlock,
} from '~/types/bible';

import { BIBLE_BOOK_CODES, getBookCode } from '~/lib/constants';
import { makeReferenceId } from '~/utils/bible/reference';

/* ------------------------------------------------------------------
 * USJ footnote data structures
 * ------------------------------------------------------------------ */
interface USJCharNode {
  type: 'char';
  marker: string; // "fr", "ft", etc.
  content: string[];
}

interface USJNote {
  type: 'note';
  content: (string | USJCharNode)[];
}

interface ExtractedFootnote {
  ref: string;
  text: string;
  letter?: string;
}

interface BookNode extends ContentNode {
  type: 'book';
  code: string; // e.g. "GEN"
}

function isBookNode(n: ContentNode): n is BookNode {
  return n.type === 'book' && typeof (n as any).code === 'string';
}

/**
 * parseUSJToIR:
 *   - Loops over each book key in usjData (e.g. "01GENBSB").
 *   - Creates a new IRBook with code = "GEN" (the 3-letter code).
 *   - Stores a user-friendly title from BIBLE_BOOK_CODES if available.
 *   - Builds IRChapters and IRVerses with references like "GEN-1-1".
 */
export function parseUSJToIR(usjData: Root): IR {
  const ir: IR = { books: [] };

  // Current parse state
  let currentBook: IRBook | null = null;
  let currentChapter: IRChapter | null = null;
  let currentVerse: IRVerse | null = null;
  let currentVerseBlock: VerseBlock | null = null;

  let textBuffer = '';
  let verseContinuing = false;
  let currentVerseNumber: number | null = null;
  let currentVerseSid: string | null = null;
  let footnoteIndex = 0;

  function startBook(usjKey: string) {
    // 1) Grab the 3-letter code from the USJ key (e.g. "01GENBSB" -> "GEN")
    const rawCode = getBookCode(usjKey);

    // 2) If the USJ content has a "book" node with a code, that might override
    //    but typically it should match anyway:
    //    We'll set this once we see isBookNode(...) in the content.
    //    For now, just store rawCode. We'll allow a second pass to override it if needed.

    const displayTitle = BIBLE_BOOK_CODES[rawCode] ?? rawCode;

    currentBook = {
      code: rawCode, // e.g. "GEN"
      bookId: makeReferenceId({ book: rawCode }), // e.g. "GEN"
      title: displayTitle, // e.g. "Genesis"
      chapters: [],
    };
    ir.books.push(currentBook);
  }

  function finalizeOpenVerseAndBlock() {
    if (currentVerse) {
      finalizePartIfNeeded();
      if (currentVerseBlock) {
        currentVerseBlock.verses.push(currentVerse);
      }
      currentVerse = null;
      textBuffer = '';
    }
    if (currentVerseBlock && currentChapter) {
      if (currentVerseBlock.verses.length > 0) {
        currentChapter.elements.push(currentVerseBlock);
      }
      currentVerseBlock = null;
    }
  }

  function finalizePartIfNeeded() {
    if (!currentVerse) return;
    if (textBuffer.length > 0) {
      currentVerse.parts.push({
        text: textBuffer,
        footnotes: [],
      });
      textBuffer = '';
    }
  }

  function startChapter(numberStr: string) {
    finalizeOpenVerseAndBlock();
    verseContinuing = false;
    currentVerseNumber = null;
    currentVerseSid = null;
    footnoteIndex = 0;

    if (!currentBook) return;

    const chapterNum = Number.parseInt(numberStr, 10);

    // For display, we use the book's .title, but for IDs we use book's .code
    const chapterId = makeReferenceId({
      book: currentBook.code,
      chapter: chapterNum,
    });

    const newChapter: IRChapter = {
      chapterId,
      bookName: currentBook.code,
      number: chapterNum,
      elements: [],
    };
    currentChapter = newChapter;
    currentBook.chapters.push(newChapter);

    // If it’s the first chapter, also push a "book_title" block for a big heading
    if (chapterNum === 1) {
      const titleBlock: BookTitle = {
        type: 'book_title',
        text: currentBook.title ?? currentBook.code,
      };
      currentChapter.elements.push(titleBlock);
    }
  }

  function addHeading(text: string, level: string) {
    if (!currentChapter) return;
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

  function addReferenceLine(text: string) {
    if (!currentChapter) return;
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

  function addBlank() {
    if (!currentChapter) return;
    finalizeOpenVerseAndBlock();
    const blank: Blank = { type: 'blank' };
    currentChapter.elements.push(blank);
  }

  function startVerseBlock(style: string) {
    finalizeOpenVerseAndBlock();
    currentVerseBlock = {
      type: 'verse_block',
      style,
      verses: [],
    };
  }

  function startContinuedVerseBlock(style: string) {
    finalizeOpenVerseAndBlock();
    currentVerseBlock = {
      type: 'continued_verse_block',
      style,
      verses: [],
    };
  }

  function startVerse(numberStr: string, sid: string) {
    if (!currentBook || !currentChapter || !currentVerseBlock) return;

    const verseNum = Number.parseInt(numberStr, 10);

    // If we’re starting a new verse number, finalize the old one
    if (currentVerse && currentVerse.verseNumber !== verseNum) {
      finalizePartIfNeeded();
      currentVerseBlock.verses.push(currentVerse);
      currentVerse = null;
      textBuffer = '';
    }

    const vId = makeReferenceId({
      book: currentBook.code,
      chapter: currentChapter.number,
      verse: verseNum,
    });

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

  function attachFootnote(noteObj: USJNote) {
    if (!currentVerse) return;
    const extractedFootnotes = extractFootnoteText(noteObj);
    for (const fn of extractedFootnotes) {
      fn.letter = String.fromCharCode(97 + footnoteIndex);
      footnoteIndex++;
    }
    // Insert whatever text we have so far plus these footnotes
    textBuffer = textBuffer.trimEnd();
    currentVerse.parts.push({
      text: textBuffer,
      footnotes: extractedFootnotes,
    });
    textBuffer = '';
  }

  function extractFootnoteText(noteObj: USJNote): ExtractedFootnote[] {
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

  function handleVerseContent(contentArray: (string | ContentNode)[]) {
    for (const item of contentArray) {
      if (typeof item === 'string') {
        textBuffer += item;
      } else if (item.type === 'verse') {
        startVerse(item.number ?? '1', item.sid ?? '');
      } else if (item.type === 'note') {
        attachFootnote(item as USJNote);
      }
    }
  }

  function handleParagraphNode(node: ContentNode) {
    if (!currentBook) return;

    const marker = node.marker || '';
    const rawContent = node.content || [];
    const rawText = rawContent
      .map((c) => (typeof c === 'string' ? c : ''))
      .join('');
    const text = rawText.trim();

    const hasVerse = rawContent.some(
      (x) => typeof x === 'object' && x !== null && x.type === 'verse'
    );

    if (marker === 'h' || marker === 'toc1' || marker === 'mt1') {
      // ignore - we are setting the book title in startBook()
    } else if (marker === 'c') {
      startChapter(node.number ?? '1');
    } else if (marker.startsWith('s')) {
      addHeading(text, marker);
    } else if (marker === 'r') {
      addReferenceLine(text);
    } else if (marker === 'b') {
      addBlank();
    } else if (hasVerse) {
      // Normal text or paragraph with verse
      startVerseBlock(marker);
      handleVerseContent(rawContent);
      finalizePartIfNeeded();
      finalizeOpenVerseAndBlock();
    } else if (
      verseContinuing &&
      currentVerseNumber !== null &&
      currentVerseSid
    ) {
      // continuing an existing verse paragraph
      startContinuedVerseBlock(marker);

      const vId = makeReferenceId({
        book: currentBook.code,
        chapter: currentChapter?.number ?? 1,
        verse: currentVerseNumber,
      });

      currentVerse = {
        verseNumber: currentVerseNumber,
        sid: currentVerseSid,
        verseId: vId,
        parts: [],
      };

      for (const item of rawContent) {
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
      // Normal paragraph outside verse context
      finalizeOpenVerseAndBlock();
      verseContinuing = false;
      currentVerseNumber = null;
      currentVerseSid = null;

      if (text) {
        const paragraph: Paragraph = {
          type: 'paragraph',
          style: marker,
          text,
        };
        currentChapter?.elements.push(paragraph);
      } else if (text === '') {
        addBlank();
      }
    }
  }

  // Main loop
  for (const bkKey of Object.keys(usjData)) {
    const bookData = usjData[bkKey];
    if (!bookData || bookData.type !== 'USJ') {
      continue;
    }

    startBook(bkKey); // e.g. "01GENBSB" -> sets currentBook = { code: "GEN", ... }

    for (const node of bookData.content) {
      if (!currentBook) break;

      // If there's a "book" node, it might have a code like "GEN".
      if (isBookNode(node)) {
        // Overwrite the code if the node’s code exists
        currentBook.code = node.code;
        currentBook.bookId = makeReferenceId({ book: node.code });
        // Use the mapping for display
        currentBook.title = BIBLE_BOOK_CODES[node.code] ?? node.code;
      } else if (node.type === 'para') {
        handleParagraphNode(node);
      } else if (node.type === 'chapter' && node.number) {
        startChapter(node.number);
      }
    }

    // finalize any open verse/block in this book
    finalizeOpenVerseAndBlock();
  }

  return ir;
}
