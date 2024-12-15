import type { Message } from "ai";

import { cn } from "@lamp/ui";
import { ScrollArea } from "@lamp/ui/scroll-area";

import { Markdown } from "~/components/chat/markdown";

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-1 px-4" type="auto">
      <div className="flex flex-col gap-4 pb-16 pt-4">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  message.role === "user" ? "bg-blue-500" : "bg-orange-500",
                )}
              />
              <span>{message.role === "user" ? "You" : "Lampstand"}</span>
            </div>

            <div className={cn("flex flex-col gap-4 px-4 py-0 text-sm")}>
              <Markdown>{message.content}</Markdown>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
