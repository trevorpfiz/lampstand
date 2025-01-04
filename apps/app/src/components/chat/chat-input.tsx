import { ArrowUp } from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useMemo, useRef } from 'react';

import { models } from '@lamp/ai/models';
import { Button } from '@lamp/ui/components/button';
import { TextareaAutosize } from '@lamp/ui/components/textarea-autosize';
import { cn } from '@lamp/ui/lib/utils';

import { useChatStore } from '~/providers/chat-store-provider';
import { ModelSelect } from './model-select';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onHeightChange: (height: number) => void;
  onSubmit: (e: FormEvent) => void;
}

export function ChatInput({
  input,
  isLoading,
  onChange,
  onHeightChange,
  onSubmit,
}: ChatInputProps) {
  const modelId = useChatStore((state) => state.modelId);
  const setModelId = useChatStore((state) => state.setModelId);

  const formRef = useRef<HTMLFormElement>(null);

  // Calculate max length based on current model
  const maxInputLength = useMemo(() => {
    const model = models.find((m) => m.id === modelId);
    return Math.floor((model?.maxTokens ?? 16384) * 4 * 0.8);
  }, [modelId]);

  useEffect(() => {
    if (formRef.current) {
      onHeightChange(formRef.current.offsetHeight);
    }
  }, [onHeightChange]);

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="relative rounded-xl border bg-muted/50 transition-colors focus-within:border-primary"
    >
      <div className="relative z-10 grid rounded-xl bg-background">
        <label className="sr-only" htmlFor="chat-input">
          Chat Input
        </label>
        <div className="relative flex rounded-xl border-0">
          <TextareaAutosize
            id="chat-input"
            value={input}
            onChange={onChange}
            onHeightChange={onHeightChange}
            placeholder="Ask a question..."
            maxLength={maxInputLength}
            className={cn(
              'w-full grow overflow-auto',
              'max-h-96 min-h-[42px]',
              'p-3 pb-1.5 text-foreground text-sm',
              'placeholder:truncate placeholder:text-muted-foreground/80'
            )}
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
          />
        </div>

        <div className="flex items-center gap-2 p-3 pt-1 pb-2">
          <ModelSelect modelId={modelId} onModelChange={setModelId} />

          <div className="ml-auto flex items-center gap-2">
            <Button
              type="submit"
              variant="default"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="size-7"
            >
              <ArrowUp size={16} strokeWidth={2.25} />
              <span className="sr-only">Send Message</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
