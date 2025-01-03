import { Suspense } from 'react';

import { BibleViewerClient } from '~/components/bible/bible-viewer-client';
import { getParsedChapters } from '~/utils/bible/server-bible';

export default function StudyPage() {
  // Pre-fetch parsed bible chapters on the server
  const fullChapters = getParsedChapters();

  return (
    <main className="h-full">
      <Suspense fallback={<BibleViewerSkeleton />}>
        <BibleViewerClient chapters={fullChapters} />
      </Suspense>
    </main>
  );
}

// A simple skeleton that resembles the structure of BibleViewer
function BibleViewerSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 h-10 bg-muted" />{' '}
      {/* Placeholder for VerseNavigationBar */}
      <div className="flex-1 overflow-auto px-3">
        <div className="h-full bg-muted" />
      </div>
    </div>
  );
}
