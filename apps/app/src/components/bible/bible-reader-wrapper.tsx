'use client';

import { createClient } from '@lamp/supabase/client';
import { Spinner } from '@lamp/ui/components/spinner';
import { handleError } from '@lamp/ui/lib/utils';
import { useEffect, useState } from 'react';

import { BibleReader } from '~/components/bible/bible-reader';
import { VerseNavigationBar } from '~/components/bible/verse-navigation-bar';
import { useBibleStore } from '~/providers/bible-store-provider';
import type { IRChapter } from '~/types/bible';
import { parseBibleData } from '~/utils/bible/parse-bible-data';

export function BibleReaderWrapper() {
  const supabase = createClient();

  const [chapters, setChapters] = useState<IRChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentReference = useBibleStore((state) => state.currentReference);

  useEffect(() => {
    async function fetchBibleData() {
      try {
        setIsLoading(true);
        setError(null);

        // Get the public URL for the Bible data
        const { data } = supabase.storage
          .from('bibles')
          .getPublicUrl('ordered_bible.json');

        // Fetch the data from the public URL
        const response = await fetch(data.publicUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch Bible data');
        }

        // Parse the JSON response
        const bibleData = await response.json();

        // Parse the Bible data
        const parsedChapters = parseBibleData(bibleData);
        setChapters(parsedChapters);
      } catch (err) {
        handleError(err);
        setError('Failed to load Bible data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBibleData();
  }, [supabase]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <VerseNavigationBar />
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <BibleReader chapters={chapters} currentReference={currentReference} />
      )}
    </div>
  );
}
