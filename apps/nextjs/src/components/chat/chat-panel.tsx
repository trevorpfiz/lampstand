"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChat } from "ai/react";
import { ArrowUp, SendIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@lamp/ui";
import { Button } from "@lamp/ui/button";
import { Form, FormControl, FormField, FormItem } from "@lamp/ui/form";
import { ScrollArea } from "@lamp/ui/scroll-area";
import { Textarea } from "@lamp/ui/textarea";

const ChatFormSchema = z.object({
  message: z
    .string()
    .min(1, { message: "Message cannot be empty" })
    .max(1000, { message: "Message is too long" }),
});

type ChatFormValues = z.infer<typeof ChatFormSchema>;

export function ChatPanel() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleChatSubmit,
    isLoading,
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

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(ChatFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (data: ChatFormValues) => {
    // Create a synthetic event to work with vercel/ai's handleSubmit
    const syntheticEvent = {
      preventDefault: () => {},
      target: {
        message: {
          value: data.message,
        },
      },
    } as unknown as React.FormEvent<HTMLFormElement>;

    handleChatSubmit(syntheticEvent);
    form.reset();
  };

  // Sync the input state from useChat with the form
  useEffect(() => {
    form.setValue("message", input);
  }, [input, form]);

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
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

      <div className="border-t bg-background p-4">
        <div className="relative rounded-lg border bg-background shadow-sm">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Textarea
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleInputChange(e);
                        }}
                        placeholder="Ask a question..."
                        className="min-h-[20px] w-full resize-none rounded-lg border-0 bg-transparent px-4 py-[10px] focus-visible:outline-none focus-visible:ring-0"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                        rows={1}
                        style={{
                          maxHeight: "200px",
                          height: "auto",
                          overflowY: "auto",
                        }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = "auto";
                          target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between border-t bg-muted/50 px-3 py-1.5">
                <div className="flex items-center gap-2">
                  {/* Add option buttons here */}
                </div>
                <Button
                  type="submit"
                  variant="default"
                  size="icon"
                  className="rounded-md px-3"
                  disabled={isLoading || !form.formState.isValid}
                >
                  <ArrowUp className="h-4 w-4" strokeWidth={3} />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
