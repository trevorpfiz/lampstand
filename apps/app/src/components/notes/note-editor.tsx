"use client";

import dynamic from "next/dynamic";
import { ArrowLeft, MoreHorizontal } from "lucide-react";

import { Button } from "@lamp/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@lamp/ui/dropdown-menu";

import type { Note } from "~/types/notes";

const PlateEditor = dynamic(
  () =>
    import("~/components/editor/plate-editor").then((mod) => mod.PlateEditor),
  { ssr: false },
);

interface NoteEditorProps {
  note: Note;
  onBack: () => void;
}

export function NoteEditor({ note: _note, onBack }: NoteEditorProps) {
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
