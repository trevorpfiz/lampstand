import { verseId } from "~/utils/bible/verse";

export function parseUSJToIR(usjData) {
  const ir = { books: [] };

  let currentBook = null;
  let currentChapter = null;

  let currentVerse = null;
  let currentVerseBlock = null;
  let textBuffer = "";
  let currentFootnotes = [];

  let verseContinuing = false;
  let currentVerseNumber = null;
  let currentVerseSid = null;

  // We'll track footnotes per chapter
  let footnoteIndex = 0; // Resets each chapter

  function startBook(code) {
    currentBook = {
      code,
      title: null,
      chapters: [],
    };
    ir.books.push(currentBook);
  }

  function startChapter(number) {
    finalizeOpenVerseAndBlock();
    verseContinuing = false;
    currentVerseNumber = null;
    currentVerseSid = null;
    footnoteIndex = 0; // reset footnote letters each chapter

    currentChapter = {
      number: parseInt(number, 10),
      elements: [],
    };
    currentBook.chapters.push(currentChapter);

    // Insert book_title at the start of the first chapter
    if (currentChapter.number === 1) {
      const bookTitle = currentBook.title
        ? currentBook.title
        : currentBook.code;
      currentChapter.elements.push({
        type: "book_title",
        text: bookTitle,
      });
    }
  }

  function addHeading(text, level) {
    finalizeOpenVerseAndBlock();
    verseContinuing = false;
    currentVerseNumber = null;
    currentVerseSid = null;

    currentChapter.elements.push({
      type: "heading",
      level,
      text: text.trim(),
    });
  }

  function addReferenceLine(text) {
    finalizeOpenVerseAndBlock();
    verseContinuing = false;
    currentVerseNumber = null;
    currentVerseSid = null;

    currentChapter.elements.push({
      type: "reference_line",
      text: text.trim(),
    });
  }

  function addBlank() {
    finalizeOpenVerseAndBlock();
    currentChapter.elements.push({ type: "blank" });
  }

  function finalizeOpenVerseAndBlock() {
    if (currentVerse) {
      pushTextPart();
      if (currentVerseBlock) {
        currentVerseBlock.verses.push(currentVerse);
      }
      currentVerse = null;
      textBuffer = "";
      currentFootnotes = [];
    }

    if (currentVerseBlock) {
      if (currentVerseBlock.verses.length > 0) {
        currentChapter.elements.push(currentVerseBlock);
      }
      currentVerseBlock = null;
    }
  }

  function startVerseBlock(style) {
    finalizeOpenVerseAndBlock();
    currentVerseBlock = { type: "verse_block", style, verses: [] };
  }

  function startContinuedVerseBlock(style) {
    finalizeOpenVerseAndBlock();
    currentVerseBlock = { type: "continued_verse_block", style, verses: [] };
  }

  function pushTextPart() {
    if (!currentVerse) return;

    // If this part has footnotes, we remove trailing whitespace.
    if (currentFootnotes.length > 0) {
      textBuffer = textBuffer.trimEnd();
    }

    if (textBuffer.length > 0 || currentFootnotes.length > 0) {
      currentVerse.parts.push({
        text: textBuffer,
        footnotes: currentFootnotes,
      });
      textBuffer = "";
      currentFootnotes = [];
    }
  }

  function startVerse(number, sid) {
    if (currentVerse && currentVerse.verseNumber !== parseInt(number, 10)) {
      pushTextPart();
      currentVerseBlock.verses.push(currentVerse);
      currentVerse = null;
    }

    const verseNum = parseInt(number, 10);
    // Build a verseId using the full book title if available, else code
    const bookName = currentBook.title ? currentBook.title : currentBook.code;
    const ref = {
      book: bookName,
      chapter: currentChapter.number,
      verse: verseNum,
    };
    const vId = verseId(ref);

    currentVerse = {
      verseNumber: verseNum,
      sid,
      verseId: vId, // store the verseId in the IR
      parts: [],
    };
    verseContinuing = true;
    currentVerseNumber = verseNum;
    currentVerseSid = sid;
  }

  function attachFootnote(noteObj) {
    pushTextPart();
    const footnotes = extractFootnoteText(noteObj);
    // Assign letters to footnotes
    for (const fn of footnotes) {
      fn.letter = String.fromCharCode(97 + footnoteIndex); // 'a' + footnoteIndex
      footnoteIndex++;
    }

    // Attach footnotes to the last created part if possible
    if (currentVerse && currentVerse.parts.length > 0) {
      const lastPart = currentVerse.parts[currentVerse.parts.length - 1];
      lastPart.footnotes = lastPart.footnotes.concat(footnotes);
    } else {
      currentFootnotes = currentFootnotes.concat(footnotes);
    }
  }

  function handleVerseContent(contentArray) {
    for (const item of contentArray) {
      if (typeof item === "string") {
        textBuffer += item;
      } else if (item.type === "verse") {
        startVerse(item.number, item.sid);
      } else if (item.type === "note") {
        attachFootnote(item);
      }
    }
  }

  function extractFootnoteText(noteObj) {
    let ref = "";
    let text = "";
    for (const c of noteObj.content) {
      if (typeof c === "string") {
        text += c;
      } else if (c.type === "char") {
        if (c.marker === "fr") {
          ref += c.content.join("");
        } else if (c.marker === "ft") {
          text += c.content.join("");
        }
      }
    }
    return [{ ref: ref.trim(), text: text.trim() }];
  }

  function handleParagraphNode(node) {
    const marker = node.marker;
    const rawContent = node.content || [];
    const rawText = rawContent
      .map((c) => (typeof c === "string" ? c : ""))
      .join("");
    const text = rawText.trim();
    const hasVerse =
      node.content && node.content.some((x) => x.type === "verse");

    if (marker === "h" || marker === "toc1" || marker === "mt1") {
      if (!currentBook.title && text) {
        currentBook.title = text;
      }
    } else if (marker === "c") {
      startChapter(node.number);
    } else if (marker.startsWith("s")) {
      addHeading(text, marker);
    } else if (marker === "r") {
      addReferenceLine(text);
    } else if (marker === "b") {
      addBlank();
    } else {
      // Paragraph that may or may not have verses
      if (hasVerse) {
        // Paragraph with verses
        startVerseBlock(marker);
        handleVerseContent(node.content);
        finalizeOpenVerseAndBlock();
      } else {
        // No verse marker here
        if (
          verseContinuing &&
          currentVerseNumber !== null &&
          currentVerseSid !== null
        ) {
          // Continuing the same verse in a new block
          startContinuedVerseBlock(marker);

          currentVerse = {
            verseNumber: currentVerseNumber,
            sid: currentVerseSid,
            verseId: verseId({
              book: currentBook.title || currentBook.code,
              chapter: currentChapter.number,
              verse: currentVerseNumber,
            }),
            parts: [],
          };

          for (const item of node.content) {
            if (typeof item === "string") {
              textBuffer += item;
            } else if (item.type === "note") {
              attachFootnote(item);
            }
          }

          pushTextPart();
          currentVerseBlock.verses.push(currentVerse);
          currentVerse = null;
          finalizeOpenVerseAndBlock();
          // Keep verseContinuing = true
        } else {
          // Normal paragraph, not continuing a verse
          finalizeOpenVerseAndBlock();
          verseContinuing = false;
          currentVerseNumber = null;
          currentVerseSid = null;

          if (text) {
            currentChapter.elements.push({
              type: "paragraph",
              style: marker,
              text: rawText,
            });
          } else {
            if (rawText === "") {
              addBlank();
            } else {
              currentChapter.elements.push({
                type: "paragraph",
                style: marker,
                text: rawText,
              });
            }
          }
        }
      }
    }
  }

  const bookKeys = Object.keys(usjData);
  for (const bkKey of bookKeys) {
    const bookData = usjData[bkKey];
    if (bookData.type !== "USJ") continue;
    const content = bookData.content;

    for (const node of content) {
      if (node.type === "book") {
        startBook(node.code);
      } else if (node.type === "para") {
        handleParagraphNode(node);
      } else if (node.type === "chapter") {
        startChapter(node.number);
      }
    }
  }

  finalizeOpenVerseAndBlock();
  return ir;
}
