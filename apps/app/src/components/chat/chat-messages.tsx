'use client';

import Image from 'next/image';
import { useEffect } from 'react';

import type { Message } from '@lamp/ai';
import { Markdown as SimpleMarkdown } from '@lamp/ai/components';
import { Spinner } from '@lamp/ui/components/spinner';
import { cn } from '@lamp/ui/lib/utils';

import { useScrollToBottom } from '~/hooks/use-scroll-to-bottom';
import { Markdown } from '~/lib/markdown';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  showWatermark: boolean;
}

export function ChatMessages({
  messages,
  isLoading,
  showWatermark,
}: ChatMessagesProps) {
  const [containerRef, endRef] = useScrollToBottom<HTMLDivElement>();

  // Instantly scroll to bottom when loading cached chats
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      endRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
    }
  }, []);

  // Smooth scroll to bottom when new messages come in or loading finishes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [isLoading]);

  return (
    <div className="relative flex flex-1 flex-col overflow-auto bg-background">
      <div
        ref={containerRef}
        className="flex min-h-full flex-col gap-4 px-4 pt-4 pb-0"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner />
          </div>
        )}
        {!isLoading && showWatermark && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/icon.png"
              alt="Lampstand Logo Watermark"
              width={40}
              height={40}
              className="opacity-20"
            />
          </div>
        )}
        {!isLoading &&
          !showWatermark &&
          messages.map((message, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div
                  className={cn(
                    'h-2 w-2 rounded-full',
                    message.role === 'user' ? 'bg-blue-500' : 'bg-orange-500'
                  )}
                />
                <span>{message.role === 'user' ? 'You' : 'Lampstand'}</span>
              </div>
              <div className="flex flex-col gap-4 px-4 py-0 text-sm">
                {message.role === 'user' ? (
                  <SimpleMarkdown>{message.content}</SimpleMarkdown>
                ) : (
                  <Markdown>{message.content}</Markdown>
                )}
              </div>
            </div>
          ))}
        {/* Invisible element to scroll to */}
        <div ref={endRef} className="min-h-[56px] min-w-[56px] shrink-0" />
      </div>
    </div>
  );
}
