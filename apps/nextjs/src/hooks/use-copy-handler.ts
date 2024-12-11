// hooks/useCopyHandler.js

import { useEffect } from "react";

import { formatSelectedVerses } from "~/utils/bible/verse";

export function useCopyHandler(verseMap) {
  useEffect(() => {
    const handleCopy = (e) => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const range = selection.getRangeAt(0);
      const startNode = range.startContainer;
      const endNode = range.endContainer;

      const getAncestorVerse = (node) => {
        while (node) {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.hasAttribute("data-verse-id")
          ) {
            return node;
          }
          node = node.parentNode;
        }
        return null;
      };

      const startVerseEl = getAncestorVerse(startNode);
      const endVerseEl = getAncestorVerse(endNode);

      if (!startVerseEl || !endVerseEl) return;

      const startVerseId = startVerseEl.getAttribute("data-verse-id");
      const endVerseId = endVerseEl.getAttribute("data-verse-id");

      if (
        !startVerseId ||
        !endVerseId ||
        !verseMap.has(startVerseId) ||
        !verseMap.has(endVerseId)
      ) {
        return;
      }

      const allVerseIds = Array.from(verseMap.keys());
      const startIndex = allVerseIds.indexOf(startVerseId);
      const endIndex = allVerseIds.indexOf(endVerseId);

      if (startIndex === -1 || endIndex === -1) return;

      const selectedVerseIds = Array.from(
        new Set(
          allVerseIds.slice(
            Math.min(startIndex, endIndex),
            Math.max(startIndex, endIndex) + 1,
          ),
        ),
      );

      const selectedVerses = selectedVerseIds;

      const firstVerseData = verseMap.get(selectedVerses[0]);
      const lastVerseData = verseMap.get(
        selectedVerses[selectedVerses.length - 1],
      );

      if (!firstVerseData || !lastVerseData) return;

      const formattedText = formatSelectedVerses(selectedVerses, verseMap, {
        firstVerse: firstVerseData,
        lastVerse: lastVerseData,
      });

      // Override the clipboard data
      e.preventDefault();
      e.clipboardData.setData("text/plain", formattedText);
    };

    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, [verseMap]);
}
