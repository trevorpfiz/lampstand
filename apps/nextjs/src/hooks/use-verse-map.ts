// hooks/useVerseMap.js

import { useMemo } from "react";

import { createVerseMap } from "~/utils/bible/verse";

export function useVerseMap(chapters) {
  const verseMap = useMemo(() => createVerseMap(chapters), [chapters]);
  return verseMap;
}
