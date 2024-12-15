"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useChat } from "ai/react";
import { AnimatePresence } from "motion/react";

import { ChatInput } from "~/components/chat/chat-input";
import { ChatMessages } from "~/components/chat/chat-messages";
import { Toolbar } from "~/components/chat/toolbar";
import { convertToUIMessages } from "~/lib/utils";
import { api } from "~/trpc/react";

export function ChatPanel() {
  const pathname = usePathname();
  const studyId = pathname.split("/").pop();

  // Query existing chats and messages
  const { data: chatData } = api.chat.byStudy.useQuery(
    { studyId: studyId ?? "" },
    { enabled: !!studyId },
  );

  // Get the most recent chat if it exists
  const latestChat = chatData?.chats[0] ?? null;

  // Query messages for the latest chat
  const { data: messageData } = api.message.byChatId.useQuery(
    { chatId: latestChat?.id ?? "" },
    { enabled: !!latestChat?.id },
  );

  const uiMessages = convertToUIMessages(messageData?.messages ?? []);

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
    initialMessages: uiMessages ?? [
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
