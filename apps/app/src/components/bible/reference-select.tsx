"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, Quote } from "lucide-react";

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

import { BIBLE_VERSESS } from "~/lib/constants";
import { useBibleStore } from "~/providers/bible-store-provider";
import { parseReference, verseId } from "~/utils/bible/verse";

interface ReferenceSelectProps {
  getChapterIndex: (book: string, chapter: number) => number;
  scrollToChapterAndVerse: (chapterIndex: number, verseId?: string) => void;
}

interface Option {
  value: string;
  label: string;
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

  const [searchValue, setSearchValue] = useState<string>("");

  const handleSelect = (value: string) => {
    console.log("1. Selected value:", value);
    const reference = parseReference(value);
    if (!reference) {
      console.log("Failed to parse reference:", value);
      return;
    }

    console.log("2. Parsed reference:", reference);
    setCurrentVerse(reference);
    console.log("3. After setCurrentVerse:", currentVerse);

    const chapterIndex = getChapterIndex(reference.book, reference.chapter);
    if (chapterIndex === -1) {
      console.log("Failed to find chapter index for:", reference);
      return;
    }

    const verse = verseId(reference);
    console.log("4. Generated verseId:", verse);
    scrollToChapterAndVerse(chapterIndex, verse);
    setOpen(false);
  };

  // Flatten BIBLE_VERSES into a single list of options
  const options: Option[] = useMemo(() => {
    return BIBLE_VERSESS.map((item) => ({
      value: item.value,
      label: item.value, // Customize the label if needed
    }));
  }, []);

  // Reference to the scrolling container
  const parentRef = useRef<HTMLDivElement>(null);

  // Handle search/filtering
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

  const handleSearch = (search: string) => {
    setSearchValue(search);
    const lowerSearch = search.toLowerCase();
    const newFilteredOptions = options.filter((option) =>
      option.value.toLowerCase().includes(lowerSearch),
    );
    setFilteredOptions(newFilteredOptions);

    // Scroll to the top of the list
    virtualizer.scrollToOffset(0);
  };

  // Initialize the virtualizer
  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Set the initial value when the popover opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        virtualizer.measure();
      }, 0);
    }

    if (open && currentValue) {
      const index = filteredOptions.findIndex(
        (option) => option.value === currentValue,
      );
      console.log("index:", index);
      if (index >= 0) {
        setTimeout(() => {
          virtualizer.scrollToIndex(index, { align: "start" });
        }, 50);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
          <Quote
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
        <Command shouldFilter={false}>
          <CommandInput
            value={searchValue}
            onValueChange={handleSearch}
            placeholder="Reference"
          />
          <CommandList className="max-h-48 overflow-hidden">
            <CommandEmpty>No reference found.</CommandEmpty>
            <CommandGroup ref={parentRef} className="h-48 w-full overflow-auto">
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualItems.map((virtualItem) => {
                  const option = filteredOptions[virtualItem.index];
                  if (!option) return null; // Safety check

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleSelect}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          currentValue === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { ReferenceSelect };
