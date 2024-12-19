"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "motion/react";

import type { Chat } from "@lamp/db/schema";
import { useChat } from "@lamp/ai/react";
import { toast } from "@lamp/ui/sonner";

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
  const utils = api.useUtils();

  // Fetch chats dynamically so we always have updated list
  const { data: chatsData } = api.chat.byStudy.useQuery(
    { studyId },
    { initialData: { chats: initialChats ?? [] } },
  );

  const chats = chatsData.chats;

  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    chats[0]?.id,
  );

  // Use onSuccess to handle message updates rather than a useEffect
  const { data: messageData, isLoading: isLoadingMessages } =
    api.message.byChatId.useQuery(
      { chatId: selectedChatId ?? "" },
      {
        enabled: !!selectedChatId,
      },
    );

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
    onFinish() {
      void utils.message.byChatId.invalidate({
        chatId: selectedChatId ?? "",
      });
      void utils.chat.byStudy.invalidate({ studyId });
    },
  });

  useEffect(() => {
    if (!isLoadingMessages && messageData?.messages && selectedChatId) {
      const newMsgs = convertToUIMessages(messageData.messages);
      setMessages(newMsgs);
    }
  }, [
    isLoadingMessages,
    messageData,
    messageData?.messages,
    selectedChatId,
    setMessages,
  ]);

  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [chatInputHeight, setChatInputHeight] = useState(0);
  const chatInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatInputRef.current) {
      setChatInputHeight(chatInputRef.current.offsetHeight);
    }
  }, [input]);

  const isLoadingAny = isLoadingMessages;
  const hasNoMessages = messages.length === 0 && !isLoadingAny;

  // Add create chat mutation
  const createChatMutation = api.chat.create.useMutation({
    onSuccess: (data) => {
      // Invalidate the chat list query to refresh the data
      void utils.chat.byStudy.invalidate();
      // Select the newly created chat
      setSelectedChatId(data.chat?.id);
      // Reset messages for the new chat
      setMessages([]);
    },
    onError: () => {
      toast.error("Failed to create new chat");
    },
  });

  // Add delete chat mutation
  const deleteChatMutation = api.chat.delete.useMutation({
    onSuccess: async () => {
      await utils.chat.byStudy.invalidate({ studyId });
      // After deletion, pick the next chat
      const updatedChats = utils.chat.byStudy.getData({ studyId })?.chats ?? [];
      if (updatedChats.length > 0) {
        // Find the closest chat to the deleted one, or default to first
        const idx = updatedChats.findIndex((c) => c.id === selectedChatId);
        // If not found, selectedChatId was deleted, pick next one
        const nextChat =
          idx >= 0 && idx < updatedChats.length
            ? updatedChats[idx]
            : updatedChats[0];
        setSelectedChatId(nextChat?.id);
      } else {
        setSelectedChatId(undefined);
        setMessages([]);
      }
    },
    onError: () => {
      toast.error("Failed to delete chat");
    },
  });

  // Handlers for new chat and delete chat
  const handleNewChat = () => {
    createChatMutation.mutate({
      studyId,
      title: "New Chat",
    });
  };

  const handleDeleteChat = () => {
    if (!selectedChatId) return;

    if (
      window.confirm(
        "Are you sure you want to delete this chat? This action cannot be undone.",
      )
    ) {
      deleteChatMutation.mutate({ id: selectedChatId });
    }
  };

  useEffect(() => {
    if (chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0]?.id);
    }
  }, [chats, selectedChatId]);

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        initialChats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={(chatId) => setSelectedChatId(chatId)}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      <ChatMessages
        messages={messages}
        isLoading={isLoadingAny && !messages.length}
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
