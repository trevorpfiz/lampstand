import type { ChangeEvent, FormEvent } from "react";
import { ArrowUp, Paperclip } from "lucide-react";

import { Button } from "@lamp/ui/button";
import { ScrollArea } from "@lamp/ui/scroll-area";
import { Textarea } from "@lamp/ui/textarea";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onChange: (
    e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>,
  ) => void;
  onSubmit: (e: FormEvent) => void;
}

export function ChatInput({
  input,
  isLoading,
  onChange,
  onSubmit,
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="relative rounded-xl border bg-muted/50 transition-colors focus-within:border-primary"
    >
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
              onChange={onChange}
              placeholder="Ask a question..."
              className="box-border resize-none whitespace-pre-wrap break-words border-none p-2 pr-4 [field-sizing:content] focus:ring-0 focus:ring-offset-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e);
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
  );
}
