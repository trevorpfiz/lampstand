'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { Check, Quote } from 'lucide-react';
import { matchSorter } from 'match-sorter';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@lamp/ui/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@lamp/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@lamp/ui/components/popover';
import { cn } from '@lamp/ui/lib/utils';

import { BIBLE_VERSE_REFERENCES } from '~/lib/constants';
import { useBibleStore } from '~/providers/bible-store-provider';
import {
  type ReferenceData,
  formatReference,
  parseReferenceId,
} from '~/utils/bible/reference';

interface ReferenceSelectProps {
  scrollToReference: (ref: ReferenceData) => void;
}

/**
 * Convert "GEN-1-2" => "Genesis 1:2"
 */
function buildDisplayLabel(id: string): string | null {
  const ref = parseReferenceId(id);
  if (!ref || !ref.chapter) {
    return null; // skip if parse fails or if it's only a book-level ID
  }
  return formatReference(ref); // e.g. "Genesis 1:2"
}

export function ReferenceSelect({ scrollToReference }: ReferenceSelectProps) {
  const [open, setOpen] = useState(false);

  const currentReference = useBibleStore((state) => state.currentReference);
  const setCurrentReference = useBibleStore(
    (state) => state.setCurrentReference
  );

  // The label shown on the button, e.g. "Genesis 1:1"
  const displayValue = useMemo(
    () => formatReference(currentReference),
    [currentReference]
  );

  // Build a string ID we can look for, e.g. "GEN-1-1"
  const currentReferenceId = useMemo(() => {
    if (!currentReference.chapter) {
      return currentReference.book.toUpperCase();
    }
    if (!currentReference.verse) {
      return `${currentReference.book.toUpperCase()}-${currentReference.chapter}`;
    }
    return `${currentReference.book.toUpperCase()}-${currentReference.chapter}-${currentReference.verse}`;
  }, [currentReference]);

  const [searchValue, setSearchValue] = useState('');

  // Build the list of references from BIBLE_VERSE_REFERENCES, skipping
  // anything that lacks a chapter. We'll store them as { value, label }.
  const options = useMemo(() => {
    return BIBLE_VERSE_REFERENCES.map((item) => {
      const label = buildDisplayLabel(item.value);
      if (!label) return null;
      return { value: item.value, label };
    }).filter((x): x is { value: string; label: string } => !!x);
  }, []);

  const [filteredOptions, setFilteredOptions] = useState(options);

  // Virtual list
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  // On user selection
  const handleSelect = (value: string) => {
    const refData = parseReferenceId(value);
    if (!refData) return;
    setCurrentReference(refData);
    scrollToReference(refData);
    setOpen(false);
  };

  const handleSearch = (search: string) => {
    setSearchValue(search);
    if (search) {
      const newFiltered = matchSorter(options, search, {
        keys: ['label'],
        threshold: matchSorter.rankings.MATCHES,
      });
      setFilteredOptions(newFiltered);
    } else {
      setFilteredOptions(options);
    }
  };

  const [hasMeasured, setHasMeasured] = useState(false);

  useLayoutEffect(() => {
    if (!open || hasMeasured) return;
    requestAnimationFrame(() => {
      virtualizer.measure();
      setHasMeasured(true);
    });
  }, [open, hasMeasured, virtualizer]);

  useEffect(() => {
    if (!open || !hasMeasured) return;

    if (searchValue) {
      virtualizer.scrollToOffset(0);
      return;
    }

    // If no search, scroll to currentReferenceId if we have it
    const idx = filteredOptions.findIndex(
      (o) => o.value === currentReferenceId
    );
    if (idx >= 0) {
      virtualizer.scrollToIndex(idx, { align: 'start' });
    } else {
      virtualizer.scrollToOffset(0);
    }
  }, [
    open,
    hasMeasured,
    searchValue,
    filteredOptions,
    currentReferenceId,
    virtualizer,
  ]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={open}
          className="h-8 w-full justify-between gap-2 bg-background px-3 font-normal outline-offset-0 hover:bg-background"
        >
          {displayValue ? (
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate">{displayValue}</span>
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
          setSearchValue('');
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
                  width: '100%',
                  position: 'relative',
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
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <Check
                        size={16}
                        strokeWidth={2}
                        className={cn(
                          option.value === currentReferenceId
                            ? 'opacity-100'
                            : 'opacity-0'
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
