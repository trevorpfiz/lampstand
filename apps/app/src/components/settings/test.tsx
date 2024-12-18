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





"use client";

import { useRef } from "react";
import { Ellipsis, Plus } from "lucide-react";

import type { Chat } from "@lamp/db/schema";
import { cn } from "@lamp/ui";
import { Button } from "@lamp/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@lamp/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@lamp/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@lamp/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@lamp/ui/tooltip";

interface ChatHeaderProps {
  initialChats?: Chat[];
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: () => void;
}

export function ChatHeader({
  initialChats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: ChatHeaderProps) {
  // Handle horizontal wheel scrolling
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const onWheelHorizontalScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollAreaRef.current && e.deltaY !== 0) {
      e.preventDefault();
      scrollAreaRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="flex w-full flex-row items-center gap-0 border-b border-border bg-background">
      <div className="min-w-0 flex-1">
        <Tabs value={selectedChatId ?? ""} onValueChange={onSelectChat}>
          <ScrollArea ref={scrollAreaRef} onWheel={onWheelHorizontalScroll}>
            <TabsList className="mb-3 h-auto gap-2 rounded-none border-none bg-transparent px-0 py-1 text-foreground">
              {initialChats?.map((chat) => (
                <TabsTrigger
                  key={chat.id}
                  value={chat.id}
                  className="relative min-w-16 max-w-32 flex-shrink-0 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                  title={chat.title}
                >
                  <span className="truncate">{chat.title}</span>
                </TabsTrigger>
              ))}
              <TabsTrigger
                key={2}
                value={"2"}
                className="relative min-w-16 max-w-32 flex-shrink-0 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                title={"this is a test"}
              >
                <span className="truncate">
                  thisadfsadfsafsdadfsadfsadfsfadsadfsadfsadfsafdsadfsadfsafsdadfs
                </span>
              </TabsTrigger>
              <TabsTrigger
                key={3}
                value={"3"}
                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                title={"this is a test"}
              >
                <span className="truncate">
                  this is a test asdf asdf adsf adsf sadf ys
                </span>
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Tabs>
      </div>

      {/* Action buttons on the right side */}
      <div className="flex flex-shrink-0 flex-row items-center gap-1 pl-2 pr-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Add new chat"
              onClick={onNewChat}
            >
              <Plus size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">
            New chat
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full shadow-none"
              aria-label="Open menu"
            >
              <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onDeleteChat}>
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
