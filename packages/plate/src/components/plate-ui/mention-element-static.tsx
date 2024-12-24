import type { SlateElementProps } from '@udecode/plate-common';
import type { TMentionElement } from '@udecode/plate-mention';

import { cn } from '@udecode/cn';
import { IS_APPLE, SlateElement } from '@udecode/plate-common';

export function MentionElementStatic({
  children,
  className,
  prefix,
  ...props
}: SlateElementProps & {
  prefix?: string;
}) {
  const element = props.element as TMentionElement;

  return (
    <SlateElement
      className={cn(
        className,
        'inline-block rounded-md bg-muted px-1.5 py-0.5 align-baseline font-medium text-sm',
        element.children[0].bold === true && 'font-bold',
        element.children[0].italic === true && 'italic',
        element.children[0].underline === true && 'underline'
      )}
      data-slate-value={element.value}
      {...props}
    >
      {IS_APPLE ? (
        // Mac OS IME https://github.com/ianstormtaylor/slate/issues/3490
        <>
          {children}
          {prefix}
          {element.value}
        </>
      ) : (
        // Others like Android https://github.com/ianstormtaylor/slate/pull/5360
        <>
          {prefix}
          {element.value}
          {children}
        </>
      )}
    </SlateElement>
  );
}
