import type { ChapterData, Root } from "~/types/bible";
import { buildChapterData } from "~/utils/bible/formatting-assembly";
import { convertUSJtoSemantic } from "~/utils/bible/semantic";

export function parseBibleDataTwoPhase(data: Root): ChapterData[] {
  // Phase 1: Semantic Parsing
  const chaptersSemantic = convertUSJtoSemantic(data);

  console.log(chaptersSemantic, "semantic");

  // Phase 2: Formatting Assembly
  // const chaptersFormatted = buildChapterData(chaptersSemantic);

  // console.log(chaptersFormatted[0], "formatted");

  return chaptersSemantic;
}
