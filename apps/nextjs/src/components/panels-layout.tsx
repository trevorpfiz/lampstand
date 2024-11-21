"use client";

import { Fragment, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@lamp/ui/resizable";

import { ChatPanel } from "~/components/chat/chat-panel";
import { usePanelsStore } from "~/providers/panels-store-provider";

interface PanelsLayoutProps {
  children: React.ReactNode;
}

export function PanelsLayout({ children }: PanelsLayoutProps) {
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
        content: <ChatPanel />,
        size: 30,
      });
    }

    if (isNotesOpen) {
      activePanels.push({
        id: "notes",
        content: <div className="h-full bg-muted p-4">Notes Panel</div>,
        size: 30,
      });
    }

    // Adjust sizes based on number of panels
    const size = Math.floor(100 / activePanels.length);
    return activePanels.map((panel, i) => ({
      ...panel,
      size: i === 0 ? 100 - size * (activePanels.length - 1) : size,
      order: i,
    }));
  }, [children, isChatOpen, isNotesOpen]);

  if (panels.length === 1) {
    return <div className="h-full">{children}</div>;
  }

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
