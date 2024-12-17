"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "motion/react";

import type { Chat } from "@lamp/db/schema";
import { useChat } from "@lamp/ai/react";

import { ChatInput } from "~/components/chat/chat-input";
import { ChatMessages } from "~/components/chat/chat-messages";
import { Toolbar } from "~/components/chat/toolbar";
import { convertToUIMessages } from "~/lib/utils";
import { api } from "~/trpc/react";

interface ChatPanelProps {
  initialChats?: Chat[];
}

export function ChatPanel({ initialChats }: ChatPanelProps) {
  const { studyId } = useParams<{ studyId: string }>();

  // If initialChats is available, we know the latest chat right away.
  const latestChat = initialChats?.[0];

  // Fetch messages for the latest chat
  const { data: messageData, isLoading: isLoadingMessages } =
    api.message.byChatId.useQuery(
      { chatId: latestChat?.id ?? "" },
      { enabled: !!latestChat?.id },
    );

  const initialMessages = messageData?.messages
    ? convertToUIMessages(messageData.messages)
    : undefined;

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
    body: {
      studyId,
      chatId: latestChat?.id,
    },
    initialMessages: initialMessages,
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

  const isLoadingAny = !initialChats || isLoadingMessages;

  const hasNoMessages = messages.length === 0 && !isLoadingAny;

  return (
    <div className="flex h-full flex-col pr-0.5">
      <ChatMessages
        messages={messages}
        isLoading={isLoadingAny}
        showWatermark={hasNoMessages}
      />

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
                isLoading={isLoading || isLoadingAny}
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
