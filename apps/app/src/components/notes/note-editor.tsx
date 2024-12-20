"use client";

import dynamic from "next/dynamic";
import { ArrowLeft, Ellipsis, Trash2 } from "lucide-react";

import type { NoteId } from "@lamp/db/schema";
import { Button } from "@lamp/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@lamp/ui/dropdown-menu";
import { toast } from "@lamp/ui/sonner";
import { Spinner } from "@lamp/ui/spinner";

import { api } from "~/trpc/react";

const PlateEditor = dynamic(
  () => import("@lamp/plate").then((mod) => mod.PlateEditor),
  { ssr: false },
);

interface NoteEditorProps {
  noteId: NoteId;
  onBack: () => void;
}

export function NoteEditor(props: NoteEditorProps) {
  const { noteId, onBack } = props;
  const utils = api.useUtils();

  // Fetch note content
  const { data, isPending } = api.note.byId.useQuery({ id: noteId });

  // Delete note mutation
  const deleteNoteMutation = api.note.delete.useMutation({
    onSuccess: () => {
      // Invalidate the notes list and go back
      void utils.note.byStudy.invalidate();
      onBack();
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  const handleDeleteNote = () => {
    deleteNoteMutation.mutate({ id: noteId });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background px-2 py-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={onBack}
          className="h-6 w-6 rounded-lg shadow-none"
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 rounded-lg shadow-none"
              aria-label="Open menu"
              disabled={!noteId || deleteNoteMutation.isPending}
            >
              {deleteNoteMutation.isPending ? (
                <Spinner />
              ) : (
                <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={handleDeleteNote}
              disabled={deleteNoteMutation.isPending}
            >
              <Trash2
                className="text-destructive"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              <span>Delete note</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-auto" data-registry="plate">
        {isPending ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <PlateEditor initialContent={data?.note?.content} />
        )}
      </div>
    </div>
  );
}
