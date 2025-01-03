import type { IRChapter, Root } from '~/types/bible';
import { parseUSJToIR } from '~/utils/bible/usj-to-semantic-ir';

export function parseBibleData(data: Root): IRChapter[] {
  // Phase 1: Semantic Parsing
  const ir = parseUSJToIR(data);

  // Flatten all chapters from all books into a single array
  const allChapters = ir.books.flatMap((book) => book.chapters);

  return allChapters;
}
