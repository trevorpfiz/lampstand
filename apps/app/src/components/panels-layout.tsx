"use client";

import { Fragment, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import type { Chat, MinimalNote } from "@lamp/db/schema";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@lamp/ui/resizable";

import { ChatPanel } from "~/components/chat/chat-panel";
import { NotesPanel } from "~/components/notes/notes-panel";
import { usePanelsStore } from "~/providers/panels-store-provider";

interface PanelsLayoutProps {
  children: React.ReactNode;
  chats?: Chat[];
  notes?: MinimalNote[];
}

export function PanelsLayout({ children, chats, notes }: PanelsLayoutProps) {
  const { isChatOpen, isNotesOpen } = usePanelsStore(
    useShallow((state) => ({
      isChatOpen: state.isChatOpen,
      isNotesOpen: state.isNotesOpen,
    })),
  );

  const panels = useMemo(() => {
    const activePanels = [{ id: "main", content: children, size: 100 }];

    if (isChatOpen) {
      activePanels.push({
        id: "chat",
        // Pass chats to ChatPanel
        content: <ChatPanel initialChats={chats} />,
        size: 30,
      });
    }

    if (isNotesOpen) {
      activePanels.push({
        id: "notes",
        // Pass notes to NotesPanel
        content: <NotesPanel initialNotes={notes} />,
        size: 30,
      });
    }

    // Adjust sizes
    const size = Math.floor(100 / activePanels.length);
    return activePanels.map((panel, i) => ({
      ...panel,
      size: i === 0 ? 100 - size * (activePanels.length - 1) : size,
      order: i,
    }));
  }, [children, isChatOpen, isNotesOpen, chats, notes]);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {panels.map((panel, i) => (
        <Fragment key={panel.id}>
          <ResizablePanel
            id={panel.id}
            order={panel.order}
            defaultSize={panel.size}
            minSize={15}
          >
            {panel.content}
          </ResizablePanel>
          {i < panels.length - 1 && <ResizableHandle withHandle />}
        </Fragment>
      ))}
    </ResizablePanelGroup>
  );
}
