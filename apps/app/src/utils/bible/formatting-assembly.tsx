import React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@lamp/ui/components/tooltip';
import { cn } from '@lamp/ui/lib/utils';
import { useTheme } from '@lamp/ui/providers/theme';

interface Footnote {
  ref: string;
  text: string;
  letter?: string;
}

interface Part {
  text: string;
  footnotes: Footnote[];
}

interface Verse {
  verseNumber: number;
  sid: string;
  verseId: string;
  parts: Part[];
}

interface VerseBlock {
  type: 'verse_block' | 'continued_verse_block';
  style: string;
  verses: Verse[];
}

interface Paragraph {
  type: 'paragraph';
  style: string;
  text: string;
}

interface Heading {
  type: 'heading';
  level: string;
  text: string;
}

interface ReferenceLine {
  type: 'reference_line';
  text: string;
}

interface Blank {
  type: 'blank';
}

interface BookTitle {
  type: 'book_title';
  text: string;
}

type ChapterElement =
  | VerseBlock
  | Paragraph
  | Heading
  | ReferenceLine
  | Blank
  | BookTitle;

export interface IRChapter {
  number: number;
  elements: ChapterElement[];
  bookName: string;
}

export interface IRBook {
  code: string;
  title: string | null;
  chapters: IRChapter[];
}

export interface IR {
  books: IRBook[];
}

const BibleHeading: React.FC<{ heading: Heading }> = ({ heading }) => {
  const Tag = heading.level === 's1' ? 'h2' : 'h3';
  return (
    <Tag className={heading.level === 's1' ? 'mt-4 font-bold' : 'my-4 italic'}>
      {heading.text}
    </Tag>
  );
};

const ReferenceLineComp: React.FC<{ reference: ReferenceLine }> = ({
  reference,
}) => {
  return <p className="italic">{reference.text}</p>;
};

const BlankLine: React.FC = () => {
  return <div className="my-4" />;
};

const BookTitleComp: React.FC<{ title: BookTitle }> = ({ title }) => {
  return (
    <h1 className="my-6 text-center font-bold text-4xl">
      {title.text.toUpperCase()}
    </h1>
  );
};

function styleToClassName(style: string) {
  switch (style) {
    case 'm':
    case 'pmo':
      return 'text-justify';
    case 'q1':
      return 'pl-8 italic';
    case 'q2':
      return 'pl-12 italic';
    default:
      return 'text-justify';
  }
}

interface VerseBlockProps {
  block: VerseBlock;
  chapterNumber: number;
}

const VerseBlockComp: React.FC<VerseBlockProps> = ({
  block,
  chapterNumber,
}) => {
  const className = styleToClassName(block.style);
  const { resolvedTheme } = useTheme();

  return (
    <p className={className}>
      {block.verses.map((verse, vi) => {
        const isFirstVerse = verse.verseNumber === 1;

        return (
          <span data-verse-id={verse.verseId} key={vi}>
            {block.type === 'verse_block' &&
              (isFirstVerse ? (
                <span className="align-middle font-bold text-2xl">
                  {chapterNumber}{' '}
                </span>
              ) : (
                <span className="align-text-top font-medium text-[11px]">
                  {verse.verseNumber}{' '}
                </span>
              ))}

            {verse.parts.map((part, pi) => {
              const footnoteSups = part.footnotes.map((fn, fi) => (
                <Tooltip key={fi}>
                  <TooltipTrigger className="pl-[1px]">
                    <sup className="inline-block cursor-pointer font-semibold text-blue-500 text-xs italic">
                      {fn.letter ?? fn.ref}
                    </sup>
                  </TooltipTrigger>
                  <TooltipContent
                    showArrow={true}
                    className={cn('', resolvedTheme === 'light' && 'dark')}
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

// Renders a single chapter
export function renderChapter(chap: IRChapter) {
  return (
    <>
      {chap.elements.map((el, idx) => {
        switch (el.type) {
          case 'book_title':
            return <BookTitleComp key={idx} title={el} />;
          case 'heading':
            return <BibleHeading key={idx} heading={el} />;
          case 'reference_line':
            return <ReferenceLineComp key={idx} reference={el} />;
          case 'blank':
            return <BlankLine key={idx} />;
          case 'verse_block':
          case 'continued_verse_block':
            return (
              <VerseBlockComp
                key={idx}
                block={el}
                chapterNumber={chap.number}
              />
            );
          case 'paragraph':
            return <ParagraphBlock key={idx} paragraph={el} />;
          default:
            return null;
        }
      })}
    </>
  );
}
