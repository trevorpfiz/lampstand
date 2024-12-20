"use client";

import { useEffect } from "react";
import Image from "next/image";

import type { Message } from "@lamp/ai";
import { Markdown } from "@lamp/ai/components";
import { cn } from "@lamp/ui";
import { ScrollArea } from "@lamp/ui/scroll-area";
import { Spinner } from "@lamp/ui/spinner";

import { useScrollToBottom } from "~/hooks/use-scroll-to-bottom";

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
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      endRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
    }
  }, []);

  // Smooth scroll to bottom when new messages come in or loading finishes
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [isLoading]);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
      <ScrollArea className="flex-1 px-4" type="auto">
        <div
          ref={containerRef}
          className="flex min-h-full flex-col gap-4 pb-0 pt-4"
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner />
            </div>
          ) : showWatermark ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/icon.png"
                alt="Lampstand Logo Watermark"
                width={40}
                height={40}
                className="opacity-20"
              />
            </div>
          ) : (
            // Render messages if not loading and no watermark
            <>
              {messages.map((message, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        message.role === "user"
                          ? "bg-blue-500"
                          : "bg-orange-500",
                      )}
                    />
                    <span>{message.role === "user" ? "You" : "Lampstand"}</span>
                  </div>
                  <div className="flex flex-col gap-4 px-4 py-0 text-sm">
                    <Markdown>{message.content}</Markdown>
                  </div>
                </div>
              ))}
            </>
          )}
          {/* Invisible element to scroll to */}
          <div ref={endRef} className="min-h-[56px] min-w-[56px] shrink-0" />
        </div>
      </ScrollArea>
    </div>
  );
}
