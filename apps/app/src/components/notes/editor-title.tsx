import type { ChangeEvent, KeyboardEvent, Ref } from 'react';
import { forwardRef, useRef } from 'react';

import { TextareaAutosize } from '@lamp/ui/components/textarea-autosize';
import { cn } from '@lamp/ui/lib/utils';

export interface EditorTitleProps {
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onEnter?: () => void;
  className?: string;
}

export const EditorTitle = forwardRef(
  (
    { defaultValue = '', onChange, onEnter, className }: EditorTitleProps,
    ref: Ref<HTMLTextAreaElement>
  ) => {
    const isComposingRef = useRef(false);

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !isComposingRef.current) {
        event.preventDefault();
        onEnter?.();
      }
    };

    return (
      <TextareaAutosize
        ref={ref}
        defaultValue={defaultValue}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={() => {
          isComposingRef.current = false;
        }}
        placeholder="Untitled"
        aria-label="Note title"
        className={cn(
          'max-h-96 w-full grow overflow-auto',
          'font-bold text-[40px] text-foreground leading-tight',
          'placeholder:truncate placeholder:text-muted-foreground/80',
          className
        )}
        spellCheck={false}
      />
    );
  }
);
EditorTitle.displayName = 'EditorTitle';
