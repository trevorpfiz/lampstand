"use client";

import { useChat } from "ai/react";
import { ArrowUp, ChevronDown, Paperclip } from "lucide-react";

import { cn } from "@lamp/ui";
import { Button } from "@lamp/ui/button";
import { ScrollArea } from "@lamp/ui/scroll-area";
import { Textarea } from "@lamp/ui/textarea";

export function ChatPanel() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
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

  return (
    <div className="flex h-full flex-col pr-0.5">
      <ScrollArea className="flex-1 px-4" type="auto">
        <div className="flex flex-col gap-4 py-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    message.role === "user" ? "bg-blue-500" : "bg-orange-500",
                  )}
                />
                <span>{message.role === "user" ? "You" : "Lampstand"}</span>
              </div>
              <div className="px-4 py-0 text-sm">{message.content}</div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="sticky inset-x-0 bottom-0 flex items-center">
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col bg-background px-2 pb-0 sm:px-3 md:px-4">
          <div className="rounded-b-xl">
            <form
              onSubmit={handleSubmit}
              className="relative rounded-xl border bg-muted/50 transition-colors focus-within:border-primary"
            >
              <div className="absolute inset-x-0 -top-12 z-10 m-auto hidden w-fit items-center justify-center animate-in fade-in slide-in-from-bottom">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="animate-slowBounce hidden size-7 items-center justify-center rounded-full bg-background text-muted-foreground shadow-md"
                >
                  <ChevronDown className="size-5" />
                </Button>
              </div>

              <div className="relative z-10 grid rounded-xl bg-background">
                <label className="sr-only" htmlFor="chat-input">
                  Chat Input
                </label>
                <div className="relative flex rounded-xl border-0 p-0.5">
                  <ScrollArea
                    className="box-border max-h-60 w-full rounded-lg"
                    type="auto"
                  >
                    <Textarea
                      id="chat-input"
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask a question..."
                      className="box-border resize-none whitespace-pre-wrap break-words border-none p-2 pr-4 [field-sizing:content] focus:ring-0 focus:ring-offset-0"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                    />
                  </ScrollArea>
                </div>

                <div className="flex items-center gap-2 p-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-lg bg-background hover:bg-muted"
                  >
                    <Paperclip className="size-4" />
                    <span className="sr-only">Attach Files</span>
                  </Button>

                  <div className="ml-auto flex items-center gap-2">
                    <Button
                      type="submit"
                      variant="default"
                      size="icon"
                      disabled={isLoading || !input.trim()}
                      className="size-8"
                    >
                      <ArrowUp className="size-4" strokeWidth={2.25} />
                      <span className="sr-only">Send Message</span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <p className="py-2 text-center text-xs text-muted-foreground"></p>
        </div>
      </div>
    </div>
  );
}
