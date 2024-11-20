"use client";

import { PencilLine, Sparkle } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@lamp/ui/button";

import { usePanelsStore } from "~/providers/panels-store-provider";

export function NavActions() {
  const { toggleChat, toggleNotes } = usePanelsStore(
    useShallow((state) => ({
      toggleChat: state.toggleChat,
      toggleNotes: state.toggleNotes,
    })),
  );

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={toggleChat}>
        <Sparkle className="h-4 w-4" />
        Chat
      </Button>
      <Button variant="secondary" size="sm" onClick={toggleNotes}>
        <PencilLine className="h-4 w-4" />
        Notes
      </Button>
    </div>
  );
}
