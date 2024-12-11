import React from "react";

import { cn } from "@lamp/ui";
import { useTheme } from "@lamp/ui/theme";
import { Tooltip, TooltipContent, TooltipTrigger } from "@lamp/ui/tooltip";

type Footnote = { ref: string; text: string };
type Part = { text: string; footnotes: Footnote[] };
type Verse = { verseNumber: number; sid: string; parts: Part[] };
type VerseBlock = {
  type: "verse_block" | "continued_verse_block";
  style: string;
  verses: Verse[];
};
type Paragraph = { type: "paragraph"; style: string; text: string };
type Heading = { type: "heading"; level: string; text: string };
type ReferenceLine = { type: "reference_line"; text: string };
type Blank = { type: "blank" };
type ChapterElement = VerseBlock | Paragraph | Heading | ReferenceLine | Blank;

export interface IRChapter {
  number: number;
  elements: ChapterElement[];
}

const BibleHeading: React.FC<{ heading: Heading }> = ({ heading }) => {
  const className = heading.level === "s1" ? "mt-4 font-bold" : "my-4 italic";
  return <h2 className={className}>{heading.text}</h2>;
};

const ReferenceLine: React.FC<{ reference: ReferenceLine }> = ({
  reference,
}) => {
  return <p className="italic">{reference.text}</p>;
};

const BlankLine: React.FC = () => {
  return <div className="my-4" />;
};

const VerseBlock: React.FC<{ block: VerseBlock }> = ({ block }) => {
  const className = styleToClassName(block.style);
  const { resolvedTheme } = useTheme();

  return (
    <p className={className}>
      {block.verses.map((verse, vi) => {
        const verseId = verse.sid.replace(" ", "-");
        return (
          <span data-verse-id={verseId} key={vi}>
            {block.type === "verse_block" && (
              <span className="align-text-top text-[11px] font-medium">
                {verse.verseNumber}{" "}
              </span>
            )}
            {verse.parts.map((part, pi) => {
              const footnoteSups = part.footnotes.map((fn, fi) => (
                <Tooltip key={fi}>
                  <TooltipTrigger>
                    <sup className="inline-block cursor-pointer text-xs font-semibold italic text-blue-500">
                      {fn.ref}
                    </sup>
                  </TooltipTrigger>
                  <TooltipContent
                    showArrow={true}
                    className={cn("", resolvedTheme === "light" && "dark")}
                  >
                    <p className="max-w-48">{fn.text}</p>
                  </TooltipContent>
                </Tooltip>
              ));
              return (
                <React.Fragment key={pi}>
                  {part.text}
                  {footnoteSups}
                </React.Fragment>
              );
            })}
          </span>
        );
      })}
    </p>
  );
};

const ParagraphBlock: React.FC<{ paragraph: Paragraph }> = ({ paragraph }) => {
  const className = styleToClassName(paragraph.style);
  return <p className={className}>{paragraph.text}</p>;
};

function styleToClassName(style: string) {
  switch (style) {
    case "m":
    case "pmo":
      return "text-justify";
    case "q1":
      return "pl-8 italic";
    case "q2":
      return "pl-12 italic";
    default:
      return "text-justify";
  }
}

// Renders a single chapter
export function renderChapter(chap: IRChapter) {
  return (
    <React.Fragment>
      {chap.elements.map((el, idx) => {
        switch (el.type) {
          case "heading":
            return <BibleHeading key={idx} heading={el} />;
          case "reference_line":
            return <ReferenceLine key={idx} reference={el} />;
          case "blank":
            return <BlankLine key={idx} />;
          case "verse_block":
          case "continued_verse_block":
            return <VerseBlock key={idx} block={el} />;
          case "paragraph":
            return <ParagraphBlock key={idx} paragraph={el} />;
          default:
            return null;
        }
      })}
    </React.Fragment>
  );
}
