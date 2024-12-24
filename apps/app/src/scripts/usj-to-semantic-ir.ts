// tsx src/scripts/usj-to-semantic-ir.ts

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type {
  ChapterSemanticData,
  ContentNode,
  HeadingLevel,
  Root,
  SemanticSegment,
  Verse,
} from '~/types/bible';

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper Function: Extract text inside note nodes
function extractNoteText(content: (string | ContentNode)[] = []): string {
  return content
    .map((c) => {
      if (typeof c === 'string') {
        return c;
      }
      if (c.type === 'char' && c.marker === 'fr') {
        return '';
      }
      if (c.type === 'char' && c.content && Array.isArray(c.content)) {
        return c.content.filter((x) => typeof x === 'string').join('');
      }
      return '';
    })
    .join('')
    .trim();
}

// Core Parser Function
function parseToSemantic(data: Root): ChapterSemanticData[] {
  const chapters: ChapterSemanticData[] = [];

  for (const [bookCode, bookObj] of Object.entries(data)) {
    const content = bookObj.content;
    const bookName =
      content.find((c) => c.marker === 'mt1')?.content?.[0]?.trim() || bookCode;

    let currentChapter: ChapterSemanticData | null = null;
    let versesMap: Record<number, Verse> = {};
    let currentVerseNumber: number | null = null;
    let footnoteIndex = 0;
    const segments: SemanticSegment[] = [];

    const finalizeVerse = () => {
      currentVerseNumber = null;
      footnoteIndex = 0;
    };

    const startVerse = (num: number) => {
      finalizeVerse();
      currentVerseNumber = num;
      if (!versesMap[num]) {
        versesMap[num] = { number: num, segments: [] };
      }
    };

    const addTextToCurrentVerse = (text: string) => {
      if (currentVerseNumber != null) {
        versesMap[currentVerseNumber].segments.push({
          type: 'text',
          content: text,
        });
      }
    };

    const addFootnoteToCurrentVerse = (noteText: string) => {
      if (currentVerseNumber != null) {
        footnoteIndex++;
        const letter = String.fromCharCode(96 + footnoteIndex); // a, b, c...
        versesMap[currentVerseNumber].segments.push({
          type: 'footnote',
          content: noteText,
          letter,
        });
      }
    };

    const addHeading = (text: string, level: HeadingLevel) => {
      finalizeVerse();
      segments.push({
        type: 'heading',
        headingLevel: level,
        text: text.trim(),
      });
    };

    const flushAccumulatedText = (
      accumulatedText: string,
      marker?: string
    ): string => {
      const trimmed = accumulatedText.trim();
      if (trimmed !== '') {
        if (currentVerseNumber != null) {
          addTextToCurrentVerse(trimmed);
          segments.push({
            type: 'verseLine',
            verseNumber: currentVerseNumber,
            text: trimmed,
            marker,
          });
        } else {
          segments.push({ type: 'otherLine', text: trimmed, marker });
        }
      }
      return '';
    };

    for (const node of content) {
      if (node.type === 'chapter' && node.marker === 'c') {
        if (currentChapter) {
          finalizeVerse();
          currentChapter.verses = versesMap;
          currentChapter.segments = [...segments];
          chapters.push(currentChapter);
        }

        currentChapter = {
          bookCode,
          bookName,
          chapterNumber: node.number || '',
          verses: {},
          segments: [],
        };
        versesMap = {};
        footnoteIndex = 0;
        segments.length = 0;
      } else if (node.type === 'para' && currentChapter) {
        const marker = node.marker || '';
        const nodeContent = node.content || [];
        let accumulatedText = '';

        if (marker === 's1' || marker === 's2') {
          const headingText = nodeContent
            .map((c) => (typeof c === 'string' ? c : ''))
            .join('');
          const level: HeadingLevel =
            marker === 's1' ? 'heading' : 'subheading';
          finalizeVerse();
          addHeading(headingText, level);
          continue;
        }

        for (const item of nodeContent) {
          if (typeof item === 'string') {
            accumulatedText += item;
          } else if (item.type === 'verse') {
            accumulatedText = flushAccumulatedText(accumulatedText, marker);
            const verseNumber = Number.parseInt(item.number || '0', 10);
            startVerse(verseNumber);
          } else if (item.type === 'note' && item.marker === 'f') {
            accumulatedText = flushAccumulatedText(accumulatedText, marker);
            const noteText = extractNoteText(item.content || []);
            addFootnoteToCurrentVerse(noteText);
          } else if (item.content && Array.isArray(item.content)) {
            const innerText = item.content
              .filter((c) => typeof c === 'string')
              .join('');
            accumulatedText += innerText;
          }
        }

        accumulatedText = flushAccumulatedText(accumulatedText, marker);
      }
    }

    if (currentChapter) {
      finalizeVerse();
      currentChapter.verses = versesMap;
      currentChapter.segments = [...segments];
      chapters.push(currentChapter);
    }
  }

  return chapters;
}

// Main Execution Function
async function main() {
  try {
    const inputPath = path.resolve(__dirname, '../public/ordered_bible.json');
    const outputPath = path.resolve(__dirname, 'semantic_ir.json');

    const rawData = await fs.readFile(inputPath, 'utf-8');
    const data = JSON.parse(rawData) as Root;

    const semanticData = parseToSemantic(data);

    await fs.writeFile(
      outputPath,
      JSON.stringify(semanticData, null, 2),
      'utf-8'
    );
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(error);
  }
}

// Run the script
main();
