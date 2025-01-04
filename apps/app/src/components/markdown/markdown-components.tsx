'use client';

import { Button } from '@lamp/ui/components/button';
import { Quote } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import type { Components } from 'react-markdown';
import { twMerge } from 'tailwind-merge';
import { useScrollToReference } from '~/hooks/use-scroll-to-reference';
import { useBibleViewerStore } from '~/providers/bible-viewer-store-provider';
import { parseReferenceId } from '~/utils/bible/reference';

// Base classes for components
export const baseClasses = {
  pre: 'mt-2 w-[80dvw] overflow-x-scroll rounded-lg bg-zinc-100 p-3 text-sm dark:bg-zinc-800 md:max-w-[500px]',
  inlineCode: 'rounded-md bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800',
  ol: 'ml-4 list-outside list-decimal',
  ul: 'ml-4 list-outside list-decimal',
  li: 'py-1',
  strong: 'font-semibold inline-flex',
  a: 'text-blue-500 hover:underline',
  h1: 'mb-2 mt-6 text-3xl font-semibold',
  h2: 'mb-2 mt-6 text-2xl font-semibold',
  h3: 'mb-2 mt-6 text-xl font-semibold',
  h4: 'mb-2 mt-6 text-lg font-semibold',
  h5: 'mb-2 mt-6 text-base font-semibold',
  h6: 'mb-2 mt-6 text-sm font-semibold',
  p: '',
};

// Define regex at module level for better performance
const LANGUAGE_REGEX = /language-(\w+)/;

export function CustomAnchor(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>
) {
  const { href, title, className, children } = props;

  const chapters = useBibleViewerStore((state) => state.chapters);
  const virtualizer = useBibleViewerStore((state) => state.virtualizer);
  const containerRef = useBibleViewerStore((state) => state.containerRef);

  const scrollToReference = useScrollToReference({
    chapters,
    virtualizer: virtualizer ?? undefined,
    containerRef: containerRef ?? null,
  });

  // If title has something like "bible:GEN-1-1"
  if (title?.startsWith('bible:')) {
    const refString = title.slice('bible:'.length);
    const parsed = parseReferenceId(refString);
    if (!parsed) {
      return <span>{children}</span>;
    }
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => scrollToReference(parsed)}
        className="h-4 w-4 opacity-60 transition-opacity hover:bg-transparent hover:opacity-100"
      >
        <Quote size={12} strokeWidth={2} />
      </Button>
    );
  }

  // 2) Fallback: normal link
  return (
    <Link
      href={href ?? '#'}
      className={twMerge(baseClasses.a, className)}
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </Link>
  );
}

export const markdownComponents: Partial<Components> = {
  code: ({ node, inline, className, children, ...props }) => {
    const match = LANGUAGE_REGEX.exec(className || '');
    return !inline && match ? (
      <pre {...props} className={twMerge(baseClasses.pre, className)}>
        <code className={match[1]}>{children}</code>
      </pre>
    ) : (
      <code className={twMerge(baseClasses.inlineCode, className)} {...props}>
        {children}
      </code>
    );
  },
  ol: ({ node, children, className, ...props }) => (
    <ol className={twMerge(baseClasses.ol, className)} {...props}>
      {children}
    </ol>
  ),
  ul: ({ node, children, className, ...props }) => (
    <ul className={twMerge(baseClasses.ul, className)} {...props}>
      {children}
    </ul>
  ),
  li: ({ node, children, className, ...props }) => (
    <li className={twMerge(baseClasses.li, className)} {...props}>
      {children}
    </li>
  ),
  strong: ({ node, children, className, ...props }) => (
    <span className={twMerge(baseClasses.strong, className)} {...props}>
      {children}
    </span>
  ),
  a: ({ node, children, className, ...props }) => {
    return (
      <CustomAnchor className={className} {...props}>
        {children}
      </CustomAnchor>
    );
  },
  h1: ({ node, children, className, ...props }) => (
    <h1 className={twMerge(baseClasses.h1, className)} {...props}>
      {children}
    </h1>
  ),
  h2: ({ node, children, className, ...props }) => (
    <h2 className={twMerge(baseClasses.h2, className)} {...props}>
      {children}
    </h2>
  ),
  h3: ({ node, children, className, ...props }) => (
    <h3 className={twMerge(baseClasses.h3, className)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ node, children, className, ...props }) => (
    <h4 className={twMerge(baseClasses.h4, className)} {...props}>
      {children}
    </h4>
  ),
  h5: ({ node, children, className, ...props }) => (
    <h5 className={twMerge(baseClasses.h5, className)} {...props}>
      {children}
    </h5>
  ),
  h6: ({ node, children, className, ...props }) => (
    <h6 className={twMerge(baseClasses.h6, className)} {...props}>
      {children}
    </h6>
  ),
  p: ({ node, children, className, ...props }) => (
    <p className={twMerge(baseClasses.p, className)} {...props}>
      {children}
    </p>
  ),
};
