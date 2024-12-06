"use client";

import { useEffect, useState } from "react";

import { Button } from "@lamp/ui/button";
import { Input } from "@lamp/ui/input";

import { useBibleStore } from "~/providers/bible-store-provider";
import { parseReference, verseId } from "~/utils/bible/verse";

interface VerseNavigationBarProps {
  getChapterIndex: (book: string, chapter: number) => number;
  scrollToChapterAndVerse: (chapterIndex: number, verseId?: string) => void;
}

export function VerseNavigationBar({
  scrollToChapterAndVerse,
  getChapterIndex,
}: VerseNavigationBarProps) {
  const currentVerse = useBibleStore((state) => state.currentVerse);
  const setCurrentVerse = useBibleStore((state) => state.setCurrentVerse);
  const [input, setInput] = useState("");

  useEffect(() => {
    const newInput = `${currentVerse.book} ${currentVerse.chapter}${
      currentVerse.verse ? `:${currentVerse.verse}` : ""
    }`;
    console.log("Setting input to:", newInput);
    setInput(newInput);
  }, [currentVerse]);

  const handleNavigation = () => {
    const reference = parseReference(input);
    if (!reference) {
      console.log("Failed to parse reference");
      return;
    }

    console.log("Parsed reference:", reference);

    setCurrentVerse(reference);

    const chapterIndex = getChapterIndex(reference.book, reference.chapter);

    if (chapterIndex === -1) return;

    const verseElementId = verseId(reference);
    scrollToChapterAndVerse(chapterIndex, verseElementId);
  };

  return (
    <div className="flex items-center gap-2 border-b border-gray-200 p-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Reference"
        className="w-48"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleNavigation();
          }
        }}
      />
      <Button onMouseDown={handleNavigation} size="sm">
        Go
      </Button>
      <div className="ml-auto font-medium">
        <span>
          {`${currentVerse.book} ${currentVerse.chapter}${
            currentVerse.verse ? `:${currentVerse.verse}` : ""
          }`}
        </span>
      </div>
    </div>
  );
}
