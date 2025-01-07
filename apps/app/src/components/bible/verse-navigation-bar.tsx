'use client';

import { BibleSelect } from '~/components/bible/bible-select';
import { ReferenceSelect } from '~/components/bible/reference-select';
import { useScrollToReference } from '~/hooks/use-scroll-to-reference';
import { useBibleViewerStore } from '~/providers/bible-viewer-store-provider';

export function VerseNavigationBar() {
  const containerRef = useBibleViewerStore((state) => state.containerRef);
  const virtualizer = useBibleViewerStore((state) => state.virtualizer);
  const chapters = useBibleViewerStore((state) => state.chapters);

  const scrollToReference = useScrollToReference({
    chapters,
    virtualizer,
    containerRef,
  });

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
