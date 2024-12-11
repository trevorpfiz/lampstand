// convert the semantic data into the final ChapterData[] with formattedBlocks

import type {
  ChapterData,
  ChapterSemanticData,
  FormattedBlock,
} from "~/types/bible";

export function buildChapterData(
  chaptersSemantic: ChapterSemanticData[],
): ChapterData[] {
  const finalChapters: ChapterData[] = [];

  for (const ch of chaptersSemantic) {
    const formattedBlocks: FormattedBlock[] = [];
    // We'll accumulate lines or verses as we see segments
    // If we see verseLine segments referencing the same verse but different markers (q1, q2),
    // we could either keep them separate or unify. Let's unify lines from the same verse that appear consecutively.

    function createBlockFromSegments(
      blockType: FormattedBlock["type"],
      marker: string,
      verses: number[],
      lines?: string[],
    ) {
      formattedBlocks.push({
        type: blockType,
        marker,
        verses,
        lines: lines && lines.length > 0 ? lines : undefined,
      });
    }

    let i = 0;
    const segs = ch.segments;

    while (i < segs.length) {
      const seg = segs[i];

      if (seg.type === "heading") {
        const blockType =
          seg.headingLevel === "heading" ? "heading" : "subheading";
        createBlockFromSegments(
          blockType,
          seg.headingLevel === "heading" ? "s1" : "s2",
          [],
          [seg.text ?? ""],
        );
        i++;
      } else if (seg.type === "blank") {
        createBlockFromSegments("blank", "b", []);
        i++;
      } else if (seg.type === "otherLine") {
        // just a line without verse
        // Decide if it's poetry or paragraph or other based on marker
        // For simplicity, if marker starts with q, treat as poetry else paragraph
        let type: FormattedBlock["type"] = "other";
        if (seg.marker && seg.marker.startsWith("q")) {
          type = "poetry";
        } else if (
          seg.marker &&
          (seg.marker.startsWith("m") || seg.marker.startsWith("p"))
        ) {
          type = "paragraph";
        }
        createBlockFromSegments(type, seg.marker ?? "", [], [seg.text ?? ""]);
        i++;
      } else if (seg.type === "verseLine") {
        // verse line: we may have multiple verseLine segments in a row from the same verse or different verses
        // We can group them into a single block if they share similar style
        const startMarker = seg.marker ?? "m";
        const verseNums: number[] = [];
        const lineTexts: string[] = [];
        verseNums.push(seg.verseNumber!);
        lineTexts.push(seg.text ?? "");

        // Check next segments if they are also verseLine with the same marker and same verse.
        // Actually, we might want to allow multiple verses in a block if they are consecutive?
        // For simplicity, let's say we start a new block if marker or verseNumber changes.
        i++;
        while (i < segs.length && segs[i].type === "verseLine") {
          const nextSeg = segs[i];
          if (nextSeg.marker !== startMarker) break; // new formatting block
          // If nextSeg verseNumber is different, we can still continue if we want multiple verses in one block.
          // For paragraphs, it's common to have multiple verses in one paragraph.
          // For poetry, lines may come from the same verse or multiple verses. We'll allow multiple verses.
          verseNums.push(nextSeg.verseNumber!);
          lineTexts.push(nextSeg.text ?? "");
          i++;
        }

        // Determine block type from marker
        let blockType: FormattedBlock["type"] = "paragraph";
        if (startMarker === "b") blockType = "blank";
        else if (startMarker === "s1" || startMarker === "s2")
          blockType = startMarker === "s1" ? "heading" : "subheading";
        else if (startMarker.startsWith("q")) blockType = "poetry";
        else if (startMarker.startsWith("m") || startMarker.startsWith("p"))
          blockType = "paragraph";
        else blockType = "other";

        // Deduplicate verse numbers
        const uniqueVerses = Array.from(new Set(verseNums));

        createBlockFromSegments(
          blockType,
          startMarker,
          uniqueVerses,
          lineTexts,
        );
      } else {
        i++;
      }
    }

    // Now we have a final ChapterData
    finalChapters.push({
      bookCode: ch.bookCode,
      bookName: ch.bookName,
      chapterNumber: ch.chapterNumber,
      verses: ch.verses,
      formattedBlocks,
    });
  }

  return finalChapters;
}
