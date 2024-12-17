"use client";

import dynamic from "next/dynamic";
import { ArrowLeft, MoreHorizontal } from "lucide-react";

import type { NoteId } from "@lamp/db/schema";
import { Button } from "@lamp/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@lamp/ui/dropdown-menu";

// import { api } from "~/trpc/react";

const PlateEditor = dynamic(
  () =>
    import("~/components/editor/plate-editor").then((mod) => mod.PlateEditor),
  { ssr: false },
);

interface NoteEditorProps {
  noteId: NoteId;
  onBack: () => void;
}

export function NoteEditor({ noteId: _noteId, onBack }: NoteEditorProps) {
  // const { data, isLoading } = api.note.byId.useQuery({ id: noteId });

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-2 py-1">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Delete</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Export</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-auto" data-registry="plate">
        <PlateEditor />
      </div>
    </div>
  );
}
