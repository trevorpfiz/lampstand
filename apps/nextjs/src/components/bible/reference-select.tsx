"use client";

import { Fragment, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@lamp/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@lamp/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@lamp/ui/popover";

import { BIBLE_VERSES } from "~/lib/constants";
import { useBibleStore } from "~/providers/bible-store-provider";
import { parseReference } from "~/utils/bible/verse";

interface ReferenceSelectProps {
  getChapterIndex: (book: string, chapter: number) => number;
  scrollToChapterAndVerse: (chapterIndex: number, verseId?: string) => void;
}

function ReferenceSelect({
  getChapterIndex,
  scrollToChapterAndVerse,
}: ReferenceSelectProps) {
  const [open, setOpen] = useState<boolean>(false);
  const currentVerse = useBibleStore((state) => state.currentVerse);
  const setCurrentVerse = useBibleStore((state) => state.setCurrentVerse);

  const currentValue = `${currentVerse.book} ${currentVerse.chapter}${
    currentVerse.verse ? `:${currentVerse.verse}` : ""
  }`;

  const handleSelect = (value: string) => {
    const reference = parseReference(value);
    if (!reference) {
      console.log("Failed to parse reference");
      return;
    }

    setCurrentVerse(reference);

    const chapterIndex = getChapterIndex(reference.book, reference.chapter);
    if (chapterIndex === -1) return;

    const verseId = reference.verse
      ? `${reference.book}-${reference.chapter}-${reference.verse}`
      : undefined;
    scrollToChapterAndVerse(chapterIndex, verseId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20"
        >
          {currentValue ? (
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate">{currentValue}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Reference</span>
          )}
          <ChevronDown
            size={16}
            strokeWidth={2}
            className="shrink-0 text-muted-foreground/80"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Reference" />
          <CommandList className="max-h-48">
            <CommandEmpty>No reference found.</CommandEmpty>
            {BIBLE_VERSES.map((book) => (
              <Fragment key={book.book}>
                <CommandGroup heading={book.book}>
                  {book.items.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={handleSelect}
                    >
                      {item.value}
                      {currentValue === item.value && (
                        <Check size={16} strokeWidth={2} className="ml-auto" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { ReferenceSelect };
