interface ContentNode {
  type: string;
  marker?: string;
  number?: string;
  sid?: string;
  content?: (string | ContentNode)[];
}

interface VerseSegment {
  type: "text" | "note";
  text?: string;
  letter?: string;
}

interface VerseToken {
  type: "verse";
  verse: string;
  segments: VerseSegment[];
}

type ParagraphItem = string | VerseToken | NoteSegment;

interface NoteSegment {
  type: "note";
  letter: string;
  text: string;
}

interface ChapterElement {
  type: string;
  marker: string;
  lines: ParagraphItem[];
}

export interface ChapterData {
  bookCode: string;
  bookName: string;
  chapterNumber: string;
  elements: ChapterElement[];
}

function extractNoteText(content: (string | ContentNode)[]): string {
  return content
    .map((c) => {
      if (typeof c === "string") {
        return c;
      }
      if (c.type === "char" && c.marker === "fr") {
        // Exclude content with the "fr" marker
        return "";
      }
      return c.content?.join("") ?? "";
    })
    .join("")
    .trim();
}

function containsVerseNode(
  content: (string | ContentNode)[] | undefined,
): boolean {
  if (!content) return false;
  return content.some((item) => {
    if (typeof item !== "string" && item.type === "verse") {
      return true;
    }
    return false;
  });
}

function parseParagraphContent(
  content: (string | ContentNode)[],
  footnoteIndexRef: { index: number },
): ParagraphItem[] {
  const result: ParagraphItem[] = [];
  let currentVerse: VerseToken | null = null;
  let lastVerseTokenIndex: number | null = null;

  const startNewVerse = (verseNumber: string) => {
    finishCurrentVerse();
    currentVerse = { type: "verse", verse: verseNumber, segments: [] };
  };

  const finishCurrentVerse = () => {
    if (currentVerse) {
      result.push(currentVerse);
      lastVerseTokenIndex = result.length - 1;
      currentVerse = null;
    }
  };

  for (const item of content) {
    if (typeof item === "string") {
      if (currentVerse) {
        currentVerse.segments.push({ type: "text", text: item });
      } else {
        if (
          result.length > 0 &&
          typeof result[result.length - 1] === "string"
        ) {
          result[result.length - 1] =
            (result[result.length - 1] as string) + item;
        } else {
          result.push(item);
        }
      }
    } else {
      if (item.type === "verse") {
        startNewVerse(item.number ?? "");
      } else if (item.type === "note" && item.marker === "f") {
        footnoteIndexRef.index++;
        const letter = String.fromCharCode(96 + footnoteIndexRef.index);
        const noteText = extractNoteText(item.content ?? []);
        if (currentVerse) {
          currentVerse.segments.push({ type: "note", letter, text: noteText });
        } else {
          if (
            lastVerseTokenIndex !== null &&
            result[lastVerseTokenIndex] &&
            typeof result[lastVerseTokenIndex] !== "string"
          ) {
            const lastVerse = result[lastVerseTokenIndex] as VerseToken;
            lastVerse.segments.push({ type: "note", letter, text: noteText });
          } else {
            result.push({
              type: "note",
              letter,
              text: noteText,
            });
          }
        }
      } else {
        const flatText = (item.content ?? [])
          .filter((c) => typeof c === "string")
          .join("");
        if (currentVerse) {
          currentVerse.segments.push({ type: "text", text: flatText });
        } else {
          if (
            result.length > 0 &&
            typeof result[result.length - 1] === "string"
          ) {
            result[result.length - 1] =
              (result[result.length - 1] as string) + flatText;
          } else {
            result.push(flatText);
          }
        }
      }
    }
  }

  finishCurrentVerse();
  return result;
}

export function parseBibleData(data: any): ChapterData[] {
  const chapters: ChapterData[] = [];

  for (const [bookCode, bookObj] of Object.entries<any>(data)) {
    const content = bookObj.content as ContentNode[];
    const bookName =
      content.find((c) => c.marker === "mt1")?.content?.[0]?.trim() ?? bookCode;

    let currentChapter: ChapterData | null = null;
    let footnoteIndexRef = { index: 0 };

    for (const node of content) {
      if (node.type === "chapter" && node.marker === "c") {
        if (currentChapter) {
          chapters.push(currentChapter);
        }
        currentChapter = {
          bookCode,
          bookName,
          chapterNumber: node.number,
          elements: [],
        };
        footnoteIndexRef = { index: 0 };
      } else if (node.type === "para" && currentChapter) {
        const marker = node.marker ?? "";
        const nodeContent = node.content ?? [];

        if (marker === "s1") {
          const headingText = nodeContent.join("").trim();
          currentChapter.elements.push({
            type: "heading",
            marker: "s1",
            lines: [headingText],
          });
        } else if (marker === "s2") {
          const headingText = nodeContent.join("").trim();
          currentChapter.elements.push({
            type: "subheading",
            marker: "s2",
            lines: [headingText],
          });
        } else if (
          marker === "m" ||
          marker === "p" ||
          marker === "pmo" ||
          (marker.startsWith("q") && containsVerseNode(nodeContent))
        ) {
          const lines = parseParagraphContent(nodeContent, footnoteIndexRef);
          currentChapter.elements.push({
            type: "paragraph",
            marker,
            lines,
          });
        } else if (marker.startsWith("q")) {
          const lines = parseParagraphContent(nodeContent, footnoteIndexRef);
          currentChapter.elements.push({
            type: "poetry",
            marker,
            lines,
          });
        } else if (marker === "b") {
          currentChapter.elements.push({
            type: "blank",
            marker: "b",
            lines: [],
          });
        } else {
          if (nodeContent.length > 0) {
            const lines = nodeContent.map((c) =>
              typeof c === "string" ? c : "",
            );
            currentChapter.elements.push({
              type: "other",
              marker,
              lines,
            });
          }
        }
      }
    }

    if (currentChapter) {
      chapters.push(currentChapter);
    }
  }

  return chapters;
}
