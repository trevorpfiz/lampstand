"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "motion/react";

import type { Chat } from "@lamp/db/schema";
import { useChat } from "@lamp/ai/react";

import { ChatHeader } from "~/components/chat/chat-header";
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
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    initialChats?.[0]?.id,
  );

  // Fetch messages for the currently selected chat
  const { data: messageData, isLoading: isLoadingMessages } =
    api.message.byChatId.useQuery(
      { chatId: selectedChatId ?? "" },
      { enabled: !!selectedChatId },
    );

  // Convert fetched messages to UI format
  const initialMessages = messageData?.messages
    ? convertToUIMessages(messageData.messages)
    : [];

  // useChat initialization
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
      chatId: selectedChatId,
    },
    initialMessages: [],
  });

  // Update messages on chat switch
  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages, setMessages]);

  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [chatInputHeight, setChatInputHeight] = useState(0);
  const chatInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatInputRef.current) {
      setChatInputHeight(chatInputRef.current.offsetHeight);
    }
  }, [input]);

  const isLoadingAny = (!initialChats && !selectedChatId) || isLoadingMessages;
  const hasNoMessages = messages.length === 0 && !isLoadingAny;

  // Handlers for new chat and delete chat
  const handleNewChat = () => {
    // Implement logic to create a new chat
    // e.g. call a mutation, then add it to initialChats and update selectedChatId
  };

  const handleDeleteChat = () => {
    // Implement logic to delete the currently selected chat
    // e.g. call a mutation, then remove it from initialChats and update selectedChatId
  };

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        initialChats={initialChats}
        selectedChatId={selectedChatId}
        onSelectChat={(chatId) => setSelectedChatId(chatId)}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      <ChatMessages
        messages={messages}
        isLoading={isLoadingAny || isLoading}
        showWatermark={hasNoMessages}
      />

      <div className="sticky inset-x-0 bottom-0 bg-background">
        <div className="relative z-10 mx-auto w-full max-w-3xl px-2 pb-0 sm:px-3 md:px-4">
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
