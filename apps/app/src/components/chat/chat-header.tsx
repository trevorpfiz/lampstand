"use client";

import { useCallback, useEffect, useRef } from "react";
import { Ellipsis, Plus, Trash2 } from "lucide-react";

import type { Chat } from "@lamp/db/schema";
import { Button } from "@lamp/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@lamp/ui/components/dropdown-menu";
import { ScrollArea, ScrollBar } from "@lamp/ui/components/scroll-area";
import { Spinner } from "@lamp/ui/components/spinner";
import { Tabs, TabsList, TabsTrigger } from "@lamp/ui/components/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@lamp/ui/components/tooltip";
import { cn } from "@lamp/ui/lib/utils";

interface ChatHeaderProps {
  initialChats?: Chat[];
  selectedChatId?: string | undefined;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: () => void;
  isNewChatPending: boolean;
}

export function ChatHeader({
  initialChats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isNewChatPending,
}: ChatHeaderProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const onWheel = useCallback((e: WheelEvent) => {
    if (!viewportRef.current || e.deltaY === 0 || e.deltaX !== 0) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const delta = e.deltaY;
    const currPos = viewportRef.current.scrollLeft;
    const scrollWidth = viewportRef.current.scrollWidth;

    const newPos = Math.max(0, Math.min(scrollWidth, currPos + delta));
    viewportRef.current.scrollLeft = newPos;
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.addEventListener("wheel", onWheel);
    }
    return () => {
      if (viewport) {
        viewport.removeEventListener("wheel", onWheel);
      }
    };
  }, [onWheel]);

  return (
    <div className="flex min-h-0 w-full flex-row items-center gap-0">
      {selectedChatId && (
        <>
          <div className="min-w-0 flex-1">
            <Tabs value={selectedChatId} onValueChange={onSelectChat}>
              <ScrollArea viewportRef={viewportRef}>
                <TabsList className="h-auto gap-0 rounded-none border-none bg-transparent py-0 pl-0 pr-0.5 text-foreground">
                  {initialChats?.map((chat) => (
                    <TabsTrigger
                      key={chat.id}
                      value={chat.id}
                      className={cn(
                        "relative min-w-20 max-w-80 flex-shrink-0 rounded-none border-r border-border bg-muted transition-none hover:bg-background hover:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:hover:bg-background",
                        initialChats.length === 1 &&
                          "max-w-3xl border-r-0 border-none",
                      )}
                      title={chat.title}
                    >
                      <span className="truncate">{chat.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar
                  orientation="horizontal"
                  className="m-0 h-1 border-none p-0"
                />
              </ScrollArea>
            </Tabs>
          </div>

          {/* Action buttons */}
          <div className="flex flex-shrink-0 flex-row items-center gap-0 pl-1 pr-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Add new chat"
                  onClick={onNewChat}
                  className="h-6 w-6 rounded-lg shadow-none"
                  disabled={isNewChatPending}
                >
                  {isNewChatPending ? (
                    <Spinner />
                  ) : (
                    <Plus size={16} strokeWidth={2} aria-hidden="true" />
                  )}
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
                  className="h-6 w-6 rounded-lg shadow-none"
                  aria-label="Open menu"
                  disabled={!selectedChatId}
                >
                  <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={onDeleteChat}
                >
                  <Trash2
                    className="text-destructive"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span>Delete chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </div>
  );
}
