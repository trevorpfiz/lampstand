import type { ChapterData, Root } from "~/types/bible";
import { buildChapterData } from "~/utils/bible/formatting-assembly";
import { convertUSJtoSemantic } from "~/utils/bible/semantic";
import { parseUSJToIR } from "~/utils/bible/sematic";

export function parseBibleDataTwoPhase(data: Root): ChapterData[] {
  // Phase 1: Semantic Parsing
  // const chaptersSemantic = convertUSJtoSemantic(data);
  const ir = parseUSJToIR(data);
  console.log(ir.books[0]);

  // Flatten all chapters from all books into a single array
  const allChapters = ir.books.flatMap((book) => book.chapters);

  // Phase 2: Formatting Assembly
  // const chaptersFormatted = buildChapterData(chaptersSemantic);

  // console.log(chaptersFormatted[0], "formatted");

  return allChapters;
}
