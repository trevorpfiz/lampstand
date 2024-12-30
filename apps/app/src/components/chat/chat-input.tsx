import { ArrowUp } from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useRef } from 'react';

import { models } from '@lamp/ai/models';
import { Button } from '@lamp/ui/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lamp/ui/components/select';
import { TextareaAutosize } from '@lamp/ui/components/textarea-autosize';
import { cn } from '@lamp/ui/lib/utils';

import { useChatStore } from '~/providers/chat-store-provider';

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
          <Select value={modelId} onValueChange={setModelId}>
            <SelectTrigger
              id="model-select"
              className={cn(
                'h-6 w-auto min-w-12 max-w-full gap-1 border-0 bg-transparent px-1.5 font-medium text-muted-foreground/70 text-sm shadow-none',
                'focus:border-0 focus:outline-none focus:ring-0 focus:ring-offset-0',
                '[&>span]:line-clamp-1 [&>span]:flex-1 [&>span]:text-left'
              )}
            >
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem
                  key={model.id}
                  value={model.id}
                  disabled={model.premium}
                >
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
