import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@lamp/ui/components/tooltip';
import { cn } from '@lamp/ui/lib/utils';
import { useTheme } from '@lamp/ui/providers/theme';
import React from 'react';
import type {
  BookTitle,
  Heading,
  IRChapter,
  IRVerse,
  Paragraph,
  ReferenceLine,
  VerseBlock,
} from '~/types/bible';
import { formatReference, parseReferenceId } from '~/utils/bible/reference';

const VERSE_NUMBER_REGEX = /^\d+\s*/;

export function renderChapter(chap: IRChapter) {
  return (
    <div data-reference={chap.chapterId} data-ref-type="chapter">
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
    </div>
  );
}

const BookTitleComp: React.FC<{ title: BookTitle }> = ({ title }) => {
  return (
    <h1 className="my-6 text-center font-bold text-4xl">
      {title.text.toUpperCase()}
    </h1>
  );
};

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

const BlankLine: React.FC = () => <div className="my-4" />;

const ParagraphBlock: React.FC<{ paragraph: Paragraph }> = ({ paragraph }) => {
  return <p className={styleToClassName(paragraph.style)}>{paragraph.text}</p>;
};

function styleToClassName(style: string): string {
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

  return (
    <p className={className}>
      {block.verses.map((verse, vi) => (
        <VerseSpan
          key={vi}
          verse={verse}
          isFirstVerse={verse.verseNumber === 1}
          chapterNumber={chapterNumber}
          blockType={block.type}
        />
      ))}
    </p>
  );
};

interface VerseSpanProps {
  verse: IRVerse;
  isFirstVerse: boolean;
  chapterNumber: number;
  blockType: 'verse_block' | 'continued_verse_block';
}

const VerseSpan: React.FC<VerseSpanProps> = ({
  verse,
  isFirstVerse,
  chapterNumber,
  blockType,
}) => {
  const { resolvedTheme } = useTheme();

  // Extract verse text without footnotes
  const getVerseText = () => {
    // Find all verse spans with the same reference
    const verseEls = Array.from(
      document.querySelectorAll(`[data-reference="${verse.verseId}"]`)
    );

    // Clone each element and remove footnotes
    const verseTexts = verseEls.map((el) => {
      const clone = el.cloneNode(true) as HTMLElement;
      // Remove footnotes
      for (const fn of Array.from(clone.querySelectorAll('sup'))) {
        fn.remove();
      }
      return clone.textContent?.trim() || '';
    });

    // Filter out verse numbers and join the text
    const verseText = verseTexts
      .map((text) => text.replace(VERSE_NUMBER_REGEX, '')) // Remove verse numbers
      .join(' ')
      .trim();

    const ref = parseReferenceId(verse.verseId);
    if (!ref) {
      return verseText;
    }
    return `${verse.verseNumber} ${verseText}\n— ${formatReference(ref)}\n`;
  };

  // Handle click on verse number
  const handleVerseClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const text = getVerseText();
    // Dispatch custom event that will be handled by ChatPanel
    const event = new CustomEvent('addVerseToChat', {
      detail: { text },
    });
    window.dispatchEvent(event);
  };

  return (
    <span
      data-reference={verse.verseId}
      data-ref-type="verse"
      style={{ marginRight: '2px' }}
    >
      {blockType === 'verse_block' &&
        (isFirstVerse ? (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <span
            className="cursor-pointer align-middle font-bold text-2xl hover:text-blue-500"
            onClick={handleVerseClick}
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="button"
            tabIndex={0}
          >
            {chapterNumber}{' '}
          </span>
        ) : (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <span
            className="cursor-pointer align-text-top font-medium text-[11px] hover:text-blue-500"
            onClick={handleVerseClick}
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="button"
            tabIndex={0}
          >
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
};
