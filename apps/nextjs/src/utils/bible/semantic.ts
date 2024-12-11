// parse the raw USJ data into a semantic intermediate structure (ChapterSemanticData[])

import type {
  ChapterSemanticData,
  ParagraphBlock,
  SemanticOutput,
  USJChar,
  USJData,
  USJNote,
  USJVerse,
  VerseData,
} from "~/types/usj";

export function convertUSJtoSemantic(usjData: USJData): SemanticOutput {
  const output: SemanticOutput = {
    book: null,
    chapters: [],
  };

  let currentChapter: ChapterSemanticData | null = null;
  let currentParagraphBlock: ParagraphBlock | null = null;

  // Keep verses at chapter level
  let currentChapterVerses: Record<string, VerseData> = {};

  // Track the last verse number encountered in the chapter
  let lastVerseNumber: string | null = null;

  // Helper: finalize paragraph block
  function finalizeParagraphBlock() {
    if (!currentParagraphBlock) return;
    // Store paragraph block if it has content
    const hasContent =
      (currentParagraphBlock.lines && currentParagraphBlock.lines.length > 0) ||
      (currentParagraphBlock.verses && currentParagraphBlock.verses.length > 0);
    if (hasContent) {
      currentChapter?.formattedBlocks.push(currentParagraphBlock);
    }
    currentParagraphBlock = null;
    // IMPORTANT: Do NOT reset lastVerseNumber here. Verses can continue in next paragraph.
  }

  // Helper: finalize chapter
  function finalizeChapter() {
    if (!currentChapter) return;
    finalizeParagraphBlock();
    output.chapters.push(currentChapter);
    currentChapter = null;
    currentChapterVerses = {};
    lastVerseNumber = null;
  }

  // Extractors for footnotes
  function extractRefFromNote(noteObj: USJNote): string | null {
    const fr = noteObj.content.find(
      (c) => typeof c === "object" && c.type === "char" && c.marker === "fr",
    ) as USJChar | undefined;
    return fr ? fr.content.join("").trim() : null;
  }

  function extractTextFromNote(noteObj: USJNote): string | null {
    const ft = noteObj.content.find(
      (c) => typeof c === "object" && c.type === "char" && c.marker === "ft",
    ) as USJChar | undefined;
    return ft ? ft.content.join("").trim() : null;
  }

  // Get the USJ book data
  const bookKey = Object.keys(usjData)[0];
  const bookData = usjData[bookKey];
  if (bookData) {
    // Extract the book code from something like "01GENBSB"
    // Assuming the book code is the three-letter portion:
    output.book = bookKey.slice(2, 5); // e.g. "GEN"
  }

  for (const block of bookData.content) {
    switch (block.type) {
      case "book":
        if (!output.book) output.book = block.code || "Unknown Book";
        break;

      case "chapter":
        // Finish previous chapter
        if (currentChapter) {
          finalizeChapter();
        }
        currentChapter = {
          number: parseInt(block.number || "0", 10),
          verses: (currentChapterVerses = {}),
          formattedBlocks: [],
        };
        lastVerseNumber = null;
        break;

      case "para":
        if (block.marker === "s1" || block.marker === "s2") {
          // Section heading
          finalizeParagraphBlock();
          currentChapter?.formattedBlocks.push({
            type: block.marker === "s1" ? "heading" : "subheading",
            level: block.marker === "s1" ? 1 : 2,
            lines: (block.content || [])
              .map((c) => (typeof c === "string" ? c.trim() : ""))
              .filter(Boolean),
          });
        } else if (block.marker === "b") {
          // Blank line
          finalizeParagraphBlock();
          currentChapter?.formattedBlocks.push({ type: "blank" });
        } else if (block.marker === "r") {
          // Reference line
          finalizeParagraphBlock();
          currentChapter?.formattedBlocks.push({
            type: "reference",
            text: (block.content || [])
              .map((c) => (typeof c === "string" ? c : ""))
              .join("")
              .trim(),
          });
        } else {
          // Paragraph or poetry or other
          if (!currentParagraphBlock) {
            currentParagraphBlock = {
              type: block.marker?.startsWith("q") ? "poetry" : "paragraph",
              marker: block.marker,
              verses: [],
              lines: [],
            };
          }

          const contentArray = block.content || [];
          for (let item of contentArray) {
            if (typeof item === "object" && item.type === "verse") {
              // New verse marker encountered
              const verseItem = item as USJVerse;
              lastVerseNumber = verseItem.number;
              if (!currentChapterVerses[lastVerseNumber]) {
                currentChapterVerses[lastVerseNumber] = {
                  number: lastVerseNumber,
                  segments: [],
                };
              }
              if (!currentParagraphBlock.verses.includes(lastVerseNumber)) {
                currentParagraphBlock.verses.push(lastVerseNumber);
              }
            } else if (typeof item === "object" && item.type === "note") {
              // Footnote
              const note = item as USJNote;
              if (lastVerseNumber) {
                currentChapterVerses[lastVerseNumber].segments.push({
                  type: "footnote",
                  ref: extractRefFromNote(note),
                  content: extractTextFromNote(note) || "",
                });
              } else {
                // No current verse: treat as line text
                currentParagraphBlock.lines.push("[footnote outside verse?]");
              }
            } else if (typeof item === "string") {
              // Text segment
              if (lastVerseNumber) {
                // Append to the last verse seen
                currentChapterVerses[lastVerseNumber].segments.push({
                  type: "text",
                  content: item,
                });
              } else {
                // No verse number currently set, just paragraph lines
                currentParagraphBlock.lines.push(item);
              }
            }
          }
        }
        break;

      default:
        // Unhandled block types if any
        break;
    }
  }

  // Finish last chapter
  if (currentChapter) {
    finalizeParagraphBlock();
    finalizeChapter();
  }

  return output;
}
