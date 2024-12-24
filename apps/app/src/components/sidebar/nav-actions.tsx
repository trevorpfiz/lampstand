'use client';

import { PencilLine, Sparkle } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@lamp/ui/components/button';

import { usePanelsStore } from '~/providers/panels-store-provider';

export function NavActions() {
  const { toggleChat, toggleNotes, isChatOpen, isNotesOpen } = usePanelsStore(
    useShallow((state) => ({
      toggleChat: state.toggleChat,
      toggleNotes: state.toggleNotes,
      isChatOpen: state.isChatOpen,
      isNotesOpen: state.isNotesOpen,
    }))
  );

  return (
    <div className="flex items-center gap-2">
      <Button
        className="group"
        variant={isChatOpen ? 'secondary' : 'ghost'}
        size="sm"
        onMouseDown={toggleChat}
      >
        <Sparkle
          className="-ms-1 me-1 opacity-60"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
        Chat
      </Button>
      <Button
        variant={isNotesOpen ? 'secondary' : 'ghost'}
        size="sm"
        onMouseDown={toggleNotes}
      >
        <PencilLine
          className="-ms-1 me-1 opacity-60"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
        Notes
      </Button>
    </div>
  );
}
