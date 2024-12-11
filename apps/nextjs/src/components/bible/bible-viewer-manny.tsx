"use client";

import type { JSX } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Tooltip, TooltipContent, TooltipTrigger } from "@lamp/ui/tooltip";

import type { ChapterData, Root, Verse } from "~/types/bible";
import bibleData from "~/public/ordered_bible.json";
import { parseBibleDataTwoPhase } from "~/utils/bible/parse-usj-ir";
import { verseId } from "~/utils/bible/verse";

function getVerseText(verse: Verse): (JSX.Element | string)[] {
  return verse.segments.flatMap((seg, i) => {
    if (seg.type === "text") {
      const parts = seg.content.split("\n");
      return parts
        .map((p, idx) =>
          idx < parts.length - 1
            ? [
                <React.Fragment key={`${i}-${idx}`}>{p}</React.Fragment>,
                <br key={`${i}-br-${idx}`} />,
              ]
            : [<React.Fragment key={`${i}-${idx}`}>{p}</React.Fragment>],
        )
        .flat();
    } else {
      // footnote
      return [
        <Tooltip key={`tooltip-${i}`}>
          <TooltipTrigger>
            <sup className="footnote inline-block cursor-pointer text-xs font-semibold italic text-blue-500">
              {seg.letter ?? "*"}
            </sup>
          </TooltipTrigger>
          <TooltipContent showArrow={true}>
            <p className="max-w-48">{seg.content}</p>
          </TooltipContent>
        </Tooltip>,
      ];
    }
  });
}

function renderBlock(
  block: ChapterData["formattedBlocks"][number],
  chapter: ChapterData,
  key: number,
) {
  switch (block.type) {
    case "heading":
    case "subheading":
      return (
        <h2
          key={key}
          className={
            block.type === "heading" ? "my-4 font-bold" : "my-4 italic"
          }
        >
          {block.lines?.join("")}
        </h2>
      );
    case "blank":
      return <div key={key} className="mb-4" />;
    case "paragraph":
    case "poetry": {
      const indent =
        block.type === "poetry" && block.marker.startsWith("q2")
          ? "2em"
          : "1em";
      const style =
        block.type === "poetry"
          ? { textIndent: indent, textAlign: "justify" as const }
          : { textAlign: "justify" as const };

      // If no verses in this block, just lines
      if (block.verses.length === 0) {
        return (
          <p key={key} style={style}>
            {block.lines?.join("")}
          </p>
        );
      }

      // Render verses
      return (
        <p key={key} style={style}>
          {block.verses.map((vnum, idx) => {
            const verse = chapter.verses[vnum];
            if (!verse) return null;
            const vId = verseId({
              book: chapter.bookName,
              chapter: parseInt(chapter.chapterNumber, 10),
              verse: verse.number,
            });
            const verseContent = getVerseText(verse);

            return (
              <span key={idx} data-verse-id={vId}>
                <span className="align-text-top text-[11px] font-medium">
                  {verse.number}{" "}
                </span>
                {verseContent}{" "}
              </span>
            );
          })}
        </p>
      );
    }
    case "other":
    default:
      return (
        <p key={key} className="mb-4 text-justify">
          {block.lines?.join(" ")}
        </p>
      );
  }
}

const BibleViewer: React.FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const chapters = useMemo(() => parseBibleDataTwoPhase(bibleData as Root), []);

  const [enabled] = useState(true);
  const virtualizer = useVirtualizer({
    count: chapters.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 1800,
    overscan: 3,
    enabled,
  });

  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      console.log("Selected Text:", selection.toString());
      console.log("Range startContainer:", range.startContainer);
      console.log("Range endContainer:", range.endContainer);
      console.log(
        "Range commonAncestorContainer:",
        range.commonAncestorContainer,
      );

      const verseEls = Array.from(
        parentRef.current?.querySelectorAll("[data-verse-id]") ?? [],
      );
      console.log("All Verse Elements:", verseEls);

      const selectedVerseEls = verseEls.filter((el) => {
        const intersects = range.intersectsNode(el);
        console.log(
          `Element ID: ${el.getAttribute("data-verse-id")}, Intersects:`,
          intersects,
        );
        return intersects;
      });

      console.log(
        "Selected Verse Elements:",
        selectedVerseEls.map((el) => el.getAttribute("data-verse-id")),
      );

      if (selectedVerseEls.length === 0) {
        return; // Allow default copy if no verses are selected
      }

      e.preventDefault();

      // Handle single verse case
      if (selectedVerseEls.length === 1) {
        const verseEl = selectedVerseEls[0];
        console.log("Single Verse Selected:", verseEl);

        // Determine if it's a partial selection
        const isPartial =
          range.startContainer !== verseEl && range.endContainer !== verseEl;

        if (isPartial) {
          // Use the cloned content from the range for partial selection
          const partialFragment = range.cloneContents();

          // Remove footnotes
          Array.from(partialFragment.querySelectorAll("sup")).forEach((fn) =>
            fn.remove(),
          );

          const partialText = partialFragment.textContent?.trim() ?? "";
          const verseId = verseEl.getAttribute("data-verse-id") ?? "";
          const [bookRaw, chapterStr, verseNum] = verseId.split("-", 3);
          const bookName =
            bookRaw.charAt(0).toUpperCase() + bookRaw.slice(1).toLowerCase();
          const referenceLine = `— ${bookName} ${chapterStr}:${verseNum}`;

          const finalText = `${partialText}\n${referenceLine}`;
          console.log("Final Text to Copy (Partial Single Verse):", finalText);

          e.clipboardData?.setData("text/plain", finalText);
          return;
        } else {
          // Full single verse selection
          const verseClone = verseEl.cloneNode(true) as HTMLElement;
          Array.from(verseClone.querySelectorAll("sup")).forEach((fn) =>
            fn.remove(),
          );

          const verseText = verseClone.textContent?.trim() ?? "";
          const verseId = verseEl.getAttribute("data-verse-id") ?? "";
          const [bookRaw, chapterStr, verseNum] = verseId.split("-", 3);
          const bookName =
            bookRaw.charAt(0).toUpperCase() + bookRaw.slice(1).toLowerCase();
          const referenceLine = `— ${bookName} ${chapterStr}:${verseNum}`;

          const finalText = `${verseText}\n${referenceLine}`;
          console.log("Final Text to Copy (Full Single Verse):", finalText);

          e.clipboardData?.setData("text/plain", finalText);
          return;
        }
      }

      // Handle multiple verses or partial selection across verses
      const selectedRangeFragment = range.cloneContents();
      console.log("Cloned Fragment Before Removal:", selectedRangeFragment);

      Array.from(selectedRangeFragment.querySelectorAll("sup")).forEach(
        (fn) => {
          console.log("Removing Footnote:", fn);
          fn.remove();
        },
      );

      const fragmentVerseEls = Array.from(
        selectedRangeFragment.querySelectorAll("[data-verse-id]"),
      );
      console.log(
        "Extracted Verse IDs:",
        fragmentVerseEls.map((el) => el.getAttribute("data-verse-id")),
      );

      if (fragmentVerseEls.length === 0) {
        const rawSelectedText = selection.toString().trim();
        console.log("Fallback to Raw Text:", rawSelectedText);
        e.clipboardData?.setData("text/plain", rawSelectedText);
        return;
      }

      // Construct text and reference for multiple verses
      const verseTexts: string[] = [];
      let startVerse = Infinity;
      let endVerse = -Infinity;

      fragmentVerseEls.forEach((vEl) => {
        const vId = vEl.getAttribute("data-verse-id") ?? "";
        const parts = vId.split("-");
        const verseNum = parseInt(parts[2] ?? "0", 10);
        if (verseNum < startVerse) startVerse = verseNum;
        if (verseNum > endVerse) endVerse = verseNum;

        const verseText = vEl.textContent?.trim() ?? "";
        if (verseText) verseTexts.push(verseText);
      });

      if (verseTexts.length === 0) {
        verseTexts.push("");
      }

      const firstId = fragmentVerseEls[0].getAttribute("data-verse-id") ?? "";
      const [bookRaw, chapterStr] = firstId.split("-", 3);
      const bookName =
        bookRaw.charAt(0).toUpperCase() + bookRaw.slice(1).toLowerCase();

      let referenceLine = `— ${bookName} ${chapterStr}:${startVerse}`;
      if (endVerse > startVerse) {
        referenceLine += `-${endVerse}`;
      }

      const combinedText = verseTexts.join(" ");
      const finalText = `${combinedText}\n${referenceLine}`;

      console.log("Final Text to Copy (Multiple Verses):", finalText);
      e.clipboardData?.setData("text/plain", finalText);
    };

    const container = parentRef.current;
    container?.addEventListener("copy", handleCopy);
    return () => {
      container?.removeEventListener("copy", handleCopy);
    };
  }, []);

  const virtualItems = virtualizer.getVirtualItems();
  let lastBookCode: string | null = null;

  return (
    <div className="flex h-full flex-col">
      <div
        ref={parentRef}
        className="flex-1 overflow-auto px-3"
        style={{ contain: "strict" }}
      >
        <h1 key="bookname" className="my-6 text-center text-4xl font-bold">
          GENESIS
        </h1>
        <h2 className="my-4 font-bold">The Creation</h2>
        <p className="mb-4 text-justify">(John 1:1–5; Hebrews 11:1–3)</p>
        <div className="mb-4"></div>
        <p className="text-justify">
          <span data-verse-id="GENESIS-1-1">
            <span className="pr-2 align-middle text-2xl font-bold">1</span>In
            the beginning God created the heavens and the earth.
          </span>
        </p>
        <div className="mb-4"></div>
        <p className="text-justify">
          <span data-verse-id="GENESIS-1-2">
            <span className="align-text-top text-[11px] font-medium">2 </span>
            Now the earth was formless and void, and darkness was over the
            surface of the deep. And the Spirit of God was hovering over the
            surface of the waters.
          </span>
        </p>
        <div className="mb-4"></div>
        <h2 className="my-4 italic">The First Day</h2>
        <div className="mb-4"></div>
        <p className="text-justify">
          <span data-verse-id="GENESIS-1-3">
            <span className="align-text-top text-[11px] font-medium">3 </span>
            And God said, “Let there be light,”
            <sup
              className="inline-block cursor-pointer text-xs font-semibold italic text-blue-500"
              data-state="closed"
            >
              a
            </sup>{" "}
            and there was light.
          </span>
          <span data-verse-id="GENESIS-1-4">
            <span className="align-text-top text-[11px] font-medium">4 </span>
            And God saw that the light was good, and He separated the light from
            the darkness.
          </span>
          <span data-verse-id="GENESIS-1-5">
            <span className="align-text-top text-[11px] font-medium">5 </span>
            God called the light “day,” and the darkness He called “night.”
          </span>
        </p>
        <div className="mb-4"></div>
        <p className="text-justify">
          And there was evening, and there was morning—the first day.
          <button data-state="closed">
            <sup className="inline-block cursor-pointer text-xs font-semibold italic text-blue-500">
              b
            </sup>
          </button>
        </p>
      </div>
    </div>
  );
};

export default BibleViewer;
