import 'server-only';

import { cache } from 'react';

// Import the JSON file on the server
import bibleData from '~/public/ordered_bible.json';
import type { IRChapter, Root } from '~/types/bible';
import { parseBibleData } from '~/utils/bible/parse-bible-data';

// Cache the result to avoid re-parsing on every request
export const getParsedChapters = cache((): IRChapter[] => {
  const data = bibleData as Root;
  const chapters = parseBibleData(data);
  return chapters;
});
