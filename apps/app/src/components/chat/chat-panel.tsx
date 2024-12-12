"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { AnimatePresence } from "motion/react";

import { ChatInput } from "~/components/chat/chat-input";
import { ChatMessages } from "~/components/chat/chat-messages";
import { Toolbar } from "~/components/chat/toolbar";

export function ChatPanel() {
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    handleInputChange,
    append,
    isLoading,
    stop,
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm here to help you study the Bible. What would you like to know?",
      },
    ],
  });

  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [chatInputHeight, setChatInputHeight] = useState(0);

  const chatInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatInputRef.current) {
      const height = chatInputRef.current.offsetHeight;
      setChatInputHeight(height);
    }
  }, [input]);

  return (
    <div className="flex h-full flex-col pr-0.5">
      <ChatMessages messages={messages} />

      <div className="sticky inset-x-0 bottom-0">
        <div className="relative z-10 mx-auto w-full max-w-3xl bg-background px-2 pb-0 sm:px-3 md:px-4">
          <div className="relative">
            <AnimatePresence>
              <Toolbar
                isToolbarVisible={isToolbarVisible}
                setIsToolbarVisible={setIsToolbarVisible}
                append={append}
                isLoading={isLoading}
                stop={stop}
                setMessages={setMessages}
                chatInputHeight={chatInputHeight}
              />
            </AnimatePresence>

            <div ref={chatInputRef} className="rounded-b-xl">
              <ChatInput
                input={input}
                isLoading={isLoading}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
          <p className="py-2 text-center text-xs text-muted-foreground"></p>
        </div>
      </div>
    </div>
  );
}
