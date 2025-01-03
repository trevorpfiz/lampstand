'use client';

import { BibleSelect } from '~/components/bible/bible-select';
import { ReferenceSelect } from '~/components/bible/reference-select';
import type { ReferenceData } from '~/utils/bible/reference';

interface VerseNavigationBarProps {
  scrollToReference: (reference: ReferenceData) => void;
}

export function VerseNavigationBar({
  scrollToReference,
}: VerseNavigationBarProps) {
  return (
    <div className="flex items-center gap-2 border-gray-200 border-b p-2">
      <div className="w-16">
        <BibleSelect />
      </div>
      <div className="min-w-44 flex-shrink">
        <ReferenceSelect scrollToReference={scrollToReference} />
      </div>
    </div>
  );
}
