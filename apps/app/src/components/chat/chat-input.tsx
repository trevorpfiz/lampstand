import type { ChangeEvent, FormEvent } from "react";
import { ArrowUp } from "lucide-react";

import { models } from "@lamp/ai/models";
import { cn } from "@lamp/ui";
import { Button } from "@lamp/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lamp/ui/select";
import { TextareaAutosize } from "@lamp/ui/textarea-autosize";

import { useChatStore } from "~/providers/chat-store-provider";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent) => void;
}

export function ChatInput({
  input,
  isLoading,
  onChange,
  onSubmit,
}: ChatInputProps) {
  const modelId = useChatStore((state) => state.modelId);
  const setModelId = useChatStore((state) => state.setModelId);

  return (
    <form
      onSubmit={onSubmit}
      className="relative rounded-xl border bg-muted/50 transition-colors focus-within:border-primary"
    >
      <div className="relative z-10 grid rounded-xl bg-background">
        <label className="sr-only" htmlFor="chat-input">
          Chat Input
        </label>
        <div className="relative flex rounded-xl border-0">
          <TextareaAutosize
            id="chat-input"
            value={input}
            onChange={onChange}
            placeholder="Ask a question..."
            className={cn(
              "w-full grow overflow-auto",
              "max-h-96 min-h-[42px]",
              "p-3 pb-1.5 text-sm text-foreground",
              "placeholder:truncate placeholder:text-muted-foreground/80",
            )}
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
          />
        </div>

        <div className="flex items-center gap-2 p-3 pb-2 pt-1">
          <Select value={modelId} onValueChange={setModelId}>
            <SelectTrigger
              id="model-select"
              className={cn(
                "h-6 w-auto min-w-12 max-w-full gap-1 border-0 bg-transparent px-1.5 text-sm font-medium text-muted-foreground/70 shadow-none",
                "focus:border-0 focus:outline-none focus:ring-0 focus:ring-offset-0",
                "[&>span]:line-clamp-1 [&>span]:flex-1 [&>span]:text-left",
              )}
            >
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem
                  key={model.id}
                  value={model.id}
                  disabled={model.plan === "pro"}
                >
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-2">
            <Button
              type="submit"
              variant="default"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="size-7"
            >
              <ArrowUp size={16} strokeWidth={2.25} />
              <span className="sr-only">Send Message</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
