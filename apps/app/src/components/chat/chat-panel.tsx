'use client';

import { AnimatePresence } from 'motion/react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useChat } from '@lamp/ai/react';
import type { Chat } from '@lamp/db/schema';
import { handleError } from '@lamp/ui/lib/utils';

import { ChatHeader } from '~/components/chat/chat-header';
import { ChatInput } from '~/components/chat/chat-input';
import { ChatMessages } from '~/components/chat/chat-messages';
import { Toolbar } from '~/components/chat/toolbar';
import { convertToUIMessages } from '~/lib/utils';
import { useChatStore } from '~/providers/chat-store-provider';
import { api } from '~/trpc/react';

interface ChatPanelProps {
  initialChats?: Chat[];
}

export function ChatPanel({ initialChats }: ChatPanelProps) {
  const { studyId } = useParams<{ studyId: string }>();
  const utils = api.useUtils();
  const modelId = useChatStore((state) => state.modelId);

  const DRAFT_CHAT_ID = 'draft';

  // Get subscription status to determine if we need to check usage
  const [{ subscription }] =
    api.stripe.getActiveSubscriptionByUser.useSuspenseQuery();
  const isFreePlan = !subscription || subscription.status !== 'active';

  // Fetch chats dynamically so we always have updated list
  const { data: chatsData } = api.chat.byStudy.useQuery(
    { studyId },
    { initialData: { chats: initialChats ?? [] } }
  );

  const chats = chatsData.chats;

  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    chats[0]?.id
  );
  const isDraftChat = selectedChatId === DRAFT_CHAT_ID;

  // Create a draft chat object for the UI
  const draftChat = {
    id: DRAFT_CHAT_ID,
    profileId: '',
    studyId,
    title: 'New Chat',
    createdAt: new Date(),
    updatedAt: null,
    visibility: 'private' as const,
  };

  // Add draft chat to the list when in draft mode
  const displayChats = isDraftChat ? [draftChat, ...chats] : chats;

  // Use onSuccess to handle message updates rather than a useEffect
  const { data: messageData, isLoading: isLoadingMessages } =
    api.message.byChatId.useQuery(
      { chatId: selectedChatId ?? '' },
      {
        enabled: !!selectedChatId && !isDraftChat, // Don't query messages for draft chat
      }
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
    setInput,
  } = useChat({
    api: '/api/chat',
    body: {
      studyId,
      chatId: isDraftChat ? undefined : selectedChatId,
      modelId,
      isFreePlan,
    },
    initialMessages: undefined,
    onFinish() {
      if (!isDraftChat) {
        utils.message.byChatId.invalidate({
          chatId: selectedChatId ?? '',
        });
      }
      utils.chat.byStudy.invalidate({ studyId });
      // After the first message in draft mode, switch to the new chat
      if (isDraftChat) {
        utils.chat.byStudy.invalidate().then(() => {
          // Get the latest chats data
          const latestChats =
            utils.chat.byStudy.getData({ studyId })?.chats ?? [];
          // The newest chat should be first
          const newChat = latestChats[0];
          if (newChat) {
            setSelectedChatId(newChat.id);
          }
        });
      }
      // Invalidate usage data if on free plan
      if (isFreePlan) {
        utils.profile.byUser.invalidate();
      }
    },
  });

  // Update messages when we get new ones from the database
  useEffect(() => {
    if (
      !isLoadingMessages &&
      messageData?.messages &&
      selectedChatId &&
      !isDraftChat
    ) {
      const newMsgs = convertToUIMessages(messageData.messages);
      setMessages(newMsgs);
    }
  }, [
    isLoadingMessages,
    messageData,
    messageData?.messages,
    selectedChatId,
    setMessages,
    isDraftChat,
  ]);

  // Add event listener for verse clicks
  useEffect(() => {
    const handleVerseClick = (e: CustomEvent<{ text: string }>) => {
      const verseText = e.detail.text;
      // Use functional update to access latest input state
      setInput((currentInput) =>
        currentInput ? `${currentInput}\n${verseText}` : verseText
      );
    };

    window.addEventListener(
      'addVerseToChat',
      handleVerseClick as EventListener
    );
    return () => {
      window.removeEventListener(
        'addVerseToChat',
        handleVerseClick as EventListener
      );
    };
  }, [setInput]); // Only depend on setInput which is stable

  const isLoadingAny = isLoadingMessages && !isDraftChat;
  const hasNoMessages =
    (messages.length === 0 && !isLoadingAny) ||
    (isDraftChat && messages.length === 0);

  // Simplified new chat handler - just switches to draft mode
  const handleNewChat = () => {
    setSelectedChatId(DRAFT_CHAT_ID);
    setMessages([]);
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setMessages([]); // Clear messages immediately when switching
  };

  const handleDeleteChat = () => {
    if (!selectedChatId || selectedChatId === DRAFT_CHAT_ID) {
      return;
    }

    deleteChatMutation.mutate({ id: selectedChatId });
  };

  // Keep delete chat mutation with optimistic updates
  const deleteChatMutation = api.chat.delete.useMutation({
    onMutate: async (deleteVars) => {
      // Cancel any outgoing refetches
      await utils.chat.byStudy.cancel();

      // Snapshot the previous value
      const previousChats = utils.chat.byStudy.getData({ studyId });
      const previousSelectedId = selectedChatId;

      // Find the next chat to select before we delete
      const currentChats = previousChats?.chats ?? [];
      const idx = currentChats.findIndex((c) => c.id === deleteVars.id);
      const nextChat =
        idx >= 0 && idx < currentChats.length - 1
          ? currentChats[idx + 1]
          : currentChats[idx - 1];

      // Optimistically remove the chat
      utils.chat.byStudy.setData({ studyId }, (old) => {
        if (!old) return { chats: [] };
        return {
          chats: old.chats.filter((chat) => chat.id !== deleteVars.id),
        };
      });

      // Immediately update the selected chat and clear messages if needed
      if (deleteVars.id === selectedChatId) {
        setMessages([]);
        setSelectedChatId(nextChat?.id);
      }

      // Return context for potential rollback
      return { previousChats, previousSelectedId };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousChats) {
        utils.chat.byStudy.setData({ studyId }, context.previousChats);
        setSelectedChatId(context.previousSelectedId);
      }
      handleError(error);
    },
    onSettled: async () => {
      await utils.chat.byStudy.invalidate();
    },
  });

  useEffect(() => {
    if (chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0]?.id);
    }
  }, [chats, selectedChatId]);

  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [chatInputHeight, setChatInputHeight] = useState(0);
  const chatInputRef = useRef<HTMLDivElement>(null);

  // Keep this effect for initial height measurement
  useEffect(() => {
    if (chatInputRef.current) {
      setChatInputHeight(chatInputRef.current.offsetHeight);
    }
  }, []);

  // Add handler for textarea height changes
  const handleInputHeightChange = (height: number) => {
    setChatInputHeight(height);
  };

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        initialChats={displayChats}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isNewChatPending={false}
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
                input={input}
                setInput={setInput}
              />
            </AnimatePresence>
            <div ref={chatInputRef} className="rounded-b-xl">
              <ChatInput
                input={input}
                isLoading={isLoading}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                onHeightChange={handleInputHeightChange}
                stop={stop}
              />
            </div>
          </div>
          <p className="py-2 text-center text-muted-foreground text-xs" />
        </div>
      </div>
    </div>
  );
}
