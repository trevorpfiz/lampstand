import Link from 'next/link';
import { memo } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { twMerge } from 'tailwind-merge';

// Define regex at module level for better performance
const LANGUAGE_REGEX = /language-(\w+)/;

// Base classes for components
const baseClasses = {
  pre: 'mt-2 w-[80dvw] overflow-x-scroll rounded-lg bg-zinc-100 p-3 text-sm dark:bg-zinc-800 md:max-w-[500px]',
  inlineCode: 'rounded-md bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800',
  ol: 'ml-4 list-outside list-decimal',
  ul: 'ml-4 list-outside list-decimal',
  li: 'py-1',
  strong: 'font-semibold',
  a: 'text-blue-500 hover:underline',
  h1: 'mb-2 mt-6 text-3xl font-semibold',
  h2: 'mb-2 mt-6 text-2xl font-semibold',
  h3: 'mb-2 mt-6 text-xl font-semibold',
  h4: 'mb-2 mt-6 text-lg font-semibold',
  h5: 'mb-2 mt-6 text-base font-semibold',
  h6: 'mb-2 mt-6 text-sm font-semibold',
};

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components: Partial<Components> = {
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
    ol: ({ node, children, className, ...props }) => {
      return (
        <ol className={twMerge(baseClasses.ol, className)} {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, className, ...props }) => {
      return (
        <li className={twMerge(baseClasses.li, className)} {...props}>
          {children}
        </li>
      );
    },
    ul: ({ node, children, className, ...props }) => {
      return (
        <ul className={twMerge(baseClasses.ul, className)} {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, className, ...props }) => {
      return (
        <span className={twMerge(baseClasses.strong, className)} {...props}>
          {children}
        </span>
      );
    },
    a: ({ node, children, className, ...props }) => {
      return (
        <Link
          className={twMerge(baseClasses.a, className)}
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {children}
        </Link>
      );
    },
    h1: ({ node, children, className, ...props }) => {
      return (
        <h1 className={twMerge(baseClasses.h1, className)} {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, className, ...props }) => {
      return (
        <h2 className={twMerge(baseClasses.h2, className)} {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, className, ...props }) => {
      return (
        <h3 className={twMerge(baseClasses.h3, className)} {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ node, children, className, ...props }) => {
      return (
        <h4 className={twMerge(baseClasses.h4, className)} {...props}>
          {children}
        </h4>
      );
    },
    h5: ({ node, children, className, ...props }) => {
      return (
        <h5 className={twMerge(baseClasses.h5, className)} {...props}>
          {children}
        </h5>
      );
    },
    h6: ({ node, children, className, ...props }) => {
      return (
        <h6 className={twMerge(baseClasses.h6, className)} {...props}>
          {children}
        </h6>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
