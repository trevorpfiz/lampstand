'use client';

import isEqual from 'lodash.isequal';
import { ArrowLeft, Ellipsis, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { type ChangeEvent, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import type { NoteId } from '@lamp/db/schema';
import { Button } from '@lamp/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@lamp/ui/components/dropdown-menu';
import { Spinner } from '@lamp/ui/components/spinner';
import { handleError } from '@lamp/ui/lib/utils';

import { EditorTitle } from '~/components/notes/editor-title';
import { api } from '~/trpc/react';

const PlateEditor = dynamic(
  () => import('@lamp/plate').then((mod) => mod.PlateEditor),
  {
    ssr: false,
  }
);

interface NoteEditorProps {
  noteId: NoteId;
  onBack: () => void;
}

export function NoteEditor(props: NoteEditorProps) {
  const { noteId, onBack } = props;
  const utils = api.useUtils();
  const titleRef = useRef<HTMLTextAreaElement>(null);

  // Fetch note content
  const { data, isPending } = api.note.byId.useQuery({ id: noteId });

  // Title mutation
  const renameMutation = api.note.rename.useMutation({
    onSuccess: () => {
      utils.note.byId.invalidate({ id: noteId });
      utils.note.byUser.invalidate();
    },
    onError: (error) => {
      handleError(error);
    },
  });

  // Debounced handler for the title
  const handleTitleChange = useDebouncedCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newTitle = e.target.value;
      if (newTitle !== data?.note?.title) {
        renameMutation.mutate({ id: noteId, title: newTitle });
      }
    },
    500
  );

  // Body mutation
  const updateBodyMutation = api.note.update.useMutation({
    onSuccess: () => {
      utils.note.byId.invalidate({ id: noteId });
    },
    onError: (error) => {
      handleError(error);
    },
  });

  // Debounced handler for the body content
  const handleBodyChange = useDebouncedCallback((newContent: any) => {
    // Optional: compare old vs new content to avoid redundant requests
    if (!isEqual(newContent, data?.note?.content)) {
      updateBodyMutation.mutate({ id: noteId, content: newContent });
    }
  }, 750);

  // Delete note mutation
  const deleteNoteMutation = api.note.delete.useMutation({
    onSuccess: () => {
      utils.note.byUser.invalidate();
      onBack();
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const handleDeleteNote = () => {
    deleteNoteMutation.mutate({ id: noteId });
  };

  const isSaving = renameMutation.isPending || updateBodyMutation.isPending;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-border border-b bg-background px-2 py-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={onBack}
          className="h-6 w-6 rounded-lg shadow-none"
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
        </Button>

        <div className="flex items-center gap-1">
          {isSaving && <Spinner className="opacity-60" />}
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
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto bg-background">
        {isPending ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            {/* Title */}
            <div className="px-6 pt-4 sm:px-[max(24px,calc(50%-350px))]">
              <div className="relative flex">
                <EditorTitle
                  ref={titleRef}
                  defaultValue={data?.note?.title}
                  onChange={handleTitleChange}
                />
              </div>
            </div>

            {/* Editable content */}
            <div className="flex-1 pt-2" data-registry="plate">
              <PlateEditor
                initialContent={data?.note?.content}
                onChange={handleBodyChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
