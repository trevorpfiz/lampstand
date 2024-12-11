// parse the raw USJ data into a semantic intermediate structure (ChapterSemanticData[])

import type {
  BookContent,
  ChapterSemanticData,
  ContentNode,
  HeadingLevel,
  Root,
  SemanticSegment,
  Verse,
} from "~/types/bible";

function extractNoteText(content: (string | ContentNode)[]): string {
  return content
    .map((c) => {
      if (typeof c === "string") return c;
      if (c.type === "char" && c.marker === "fr") return "";
      if (c.content && Array.isArray(c.content)) {
        return c.content.filter((x) => typeof x === "string").join("");
      }
      return "";
    })
    .join("")
    .trim();
}

export function parseToSemantic(data: Root): ChapterSemanticData[] {
  const chapters: ChapterSemanticData[] = [];

  for (const [bookCode, bookObj] of Object.entries<BookContent>(data)) {
    const content = bookObj.content;
    const bookName =
      content.find((c) => c.marker === "mt1")?.content?.[0]?.trim() ?? bookCode;

    let currentChapter: ChapterSemanticData | null = null;
    let versesMap: Record<number, Verse> = {};
    let currentVerseNumber: number | null = null;
    let footnoteIndex = 0;

    // segments is the linear semantic representation of headings, verse lines, blanks, etc.
    const segments: SemanticSegment[] = [];

    function startVerse(num: number) {
      finalizeVerse();
      currentVerseNumber = num;
      if (!versesMap[num]) {
        versesMap[num] = { number: num, segments: [] };
      }
    }

    function finalizeVerse() {
      currentVerseNumber = null;
    }

    function addTextToCurrentVerse(text: string) {
      if (currentVerseNumber != null) {
        versesMap[currentVerseNumber].segments.push({
          type: "text",
          content: text,
        });
      }
    }

    function addFootnoteToCurrentVerse(noteText: string) {
      if (currentVerseNumber != null) {
        footnoteIndex++;
        const letter = String.fromCharCode(96 + footnoteIndex);
        versesMap[currentVerseNumber].segments.push({
          type: "footnote",
          content: noteText,
          letter,
        });
      }
    }

    function addHeading(text: string, level: HeadingLevel) {
      // finalize current verse
      finalizeVerse();
      segments.push({
        type: "heading",
        headingLevel: level,
        text: text.trim(),
      });
    }

    function addBlankLine() {
      // blank line
      segments.push({ type: "blank" });
    }

    function addOtherLine(text: string, marker: string) {
      // line outside any verse
      segments.push({ type: "otherLine", text: text, marker });
    }

    function addVerseLine(verseNum: number, text: string, marker: string) {
      // a line that belongs to a verse
      segments.push({ type: "verseLine", verseNumber: verseNum, text, marker });
    }

    for (const node of content) {
      if (node.type === "chapter" && node.marker === "c") {
        // New chapter starts
        // finalize previous chapter if any
        if (currentChapter) {
          finalizeVerse();
          currentChapter.verses = versesMap;
          currentChapter.segments = segments.slice();
          chapters.push(currentChapter);
        }

        currentChapter = {
          bookCode,
          bookName,
          chapterNumber: node.number,
          verses: {},
          segments: [],
        };
        versesMap = {};
        currentVerseNumber = null;
        footnoteIndex = 0;
        segments.length = 0; // clear segments for new chapter
      } else if (node.type === "para" && currentChapter) {
        const marker = node.marker ?? "";
        const nodeContent = node.content ?? [];

        // Determine block type heuristically
        let blockIsHeading = marker === "s1" || marker === "s2";
        let blockIsBlank = marker === "b";
        let blockIsPoetry = marker.startsWith("q");
        let blockIsParagraph = marker.startsWith("m") || marker.startsWith("p"); // m, pmo etc.
        let blockType: "heading" | "blank" | "other" | "potentialVerse" =
          blockIsHeading
            ? "heading"
            : blockIsBlank
              ? "blank"
              : "potentialVerse";

        // Parse the para content
        // Track if we encountered any verse markers here
        let encounteredVerse = false;
        let accumulatedText = "";
        let currentVerseInThisPara: number | null = null;

        function flushAccumulatedText() {
          if (accumulatedText.trim() !== "") {
            if (currentVerseNumber != null && currentVerseInThisPara != null) {
              // This text belongs to the current verse
              addTextToCurrentVerse(accumulatedText);
              addVerseLine(currentVerseInThisPara, accumulatedText, marker);
            } else if (
              !currentVerseNumber &&
              !blockIsHeading &&
              !blockIsBlank
            ) {
              // Text outside any verse
              addOtherLine(accumulatedText, marker);
            }
            accumulatedText = "";
          }
        }

        for (const item of nodeContent) {
          if (typeof item === "string") {
            // just text
            accumulatedText += item;
          } else {
            // ContentNode
            if (item.type === "verse") {
              // We hit a verse start
              flushAccumulatedText();
              const verseNumber = parseInt(item.number ?? "0", 10);
              startVerse(verseNumber);
              currentVerseInThisPara = verseNumber;
              encounteredVerse = true;
            } else if (item.type === "note" && item.marker === "f") {
              flushAccumulatedText();
              const noteText = extractNoteText(item.content ?? []);
              addFootnoteToCurrentVerse(noteText);
            } else if (item.content && Array.isArray(item.content)) {
              // Probably char or something similar
              const flatText = item.content
                .filter((c) => typeof c === "string")
                .join("");
              accumulatedText += flatText;
            }
          }
        }

        // end of para
        flushAccumulatedText();

        if (blockIsHeading) {
          const headingText = nodeContent
            .map((c) => (typeof c === "string" ? c : ""))
            .join("")
            .trim();
          const level: HeadingLevel =
            marker === "s1" ? "heading" : "subheading";
          addHeading(headingText, level);
        } else if (blockIsBlank) {
          addBlankLine();
        } else {
          // If no verse encountered and we have no text lines recorded, it's an other line block
          // Possibly we had text outside verse lines handled above
        }
      }
    }

    // finalize last chapter if any
    if (currentChapter) {
      finalizeVerse();
      currentChapter.verses = versesMap;
      currentChapter.segments = segments;
      chapters.push(currentChapter);
    }
  }

  return chapters;
}
