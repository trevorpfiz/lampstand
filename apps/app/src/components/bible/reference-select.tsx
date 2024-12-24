"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, Quote } from "lucide-react";
import { matchSorter } from "match-sorter";

import { Button } from "@lamp/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@lamp/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lamp/ui/components/popover";
import { cn } from "@lamp/ui/lib/utils";

import { BIBLE_VERSE_REFERENCES } from "~/lib/constants";
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
  const [open, setOpen] = useState(false);
  const currentVerse = useBibleStore((state) => state.currentVerse);
  const setCurrentVerse = useBibleStore((state) => state.setCurrentVerse);

  const currentValue = `${currentVerse.book} ${currentVerse.chapter}${
    currentVerse.verse ? `:${currentVerse.verse}` : ""
  }`;

  const [searchValue, setSearchValue] = useState("");
  const options: Option[] = useMemo(
    () =>
      BIBLE_VERSE_REFERENCES.map((item) => ({
        value: item.value,
        label: item.value,
      })),
    [],
  );

  const [filteredOptions, setFilteredOptions] = useState(options);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const handleSelect = (value: string) => {
    const reference = parseReference(value);
    if (!reference) return;

    setCurrentVerse(reference);

    const chapterIndex = getChapterIndex(reference.book, reference.chapter);
    if (chapterIndex === -1) return;

    scrollToChapterAndVerse(chapterIndex, verseId(reference));
    setOpen(false);
  };

  const handleSearch = (search: string) => {
    setSearchValue(search);
    if (!search) {
      setFilteredOptions(options);
    } else {
      const newFilteredOptions = matchSorter(options, search, {
        keys: ["label"],
        threshold: matchSorter.rankings.MATCHES,
      });
      setFilteredOptions(newFilteredOptions);
    }
  };

  // State to know when the virtualizer has been measured after popover opens
  const [hasMeasured, setHasMeasured] = useState(false);

  // 1. On open, measure layout
  useLayoutEffect(() => {
    if (!open || hasMeasured) return;

    requestAnimationFrame(() => {
      console.log("measuring");
      virtualizer.measure();
      setHasMeasured(true);
    });
  }, [open, virtualizer, hasMeasured]);

  // 2. After measurement, scroll accordingly
  // Use useLayoutEffect to avoid flicker since we're adjusting layout
  useEffect(() => {
    if (!open || !hasMeasured) return;

    // If searching, scroll to top
    // If not searching, scroll to currentValue if found, else top
    if (searchValue) {
      virtualizer.scrollToOffset(0);
    } else {
      const index = filteredOptions.findIndex((o) => o.value === currentValue);
      if (index >= 0) {
        virtualizer.scrollToIndex(index, { align: "start" });
      } else {
        virtualizer.scrollToOffset(0);
      }
    }
  }, [
    open,
    hasMeasured,
    searchValue,
    filteredOptions,
    currentValue,
    virtualizer,
  ]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-8 w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20"
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
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          setSearchValue("");
          setFilteredOptions(options);
          setHasMeasured(false);
        }}
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
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const option = filteredOptions[virtualItem.index];
                  if (!option) return null;

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
                        size={16}
                        strokeWidth={2}
                        className={cn(
                          "",
                          currentValue === option.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
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
