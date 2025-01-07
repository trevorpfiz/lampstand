import { Spinner } from '@lamp/ui/components/spinner';
import { Suspense } from 'react';

import { BibleReaderWrapper } from '~/components/bible/bible-reader-wrapper';

export default function StudyPage() {
  return (
    <main className="h-full">
      <Suspense fallback={<BibleReaderSkeleton />}>
        <BibleReaderWrapper />
      </Suspense>
    </main>
  );
}

function BibleReaderSkeleton() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Spinner />
    </div>
  );
}
