'use client';

import { FilePen, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';

import type { MinimalNote } from '@lamp/db/schema';
import { Button } from '@lamp/ui/components/button';
import { Spinner } from '@lamp/ui/components/spinner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@lamp/ui/components/tooltip';
import { handleError } from '@lamp/ui/lib/utils';

import { api } from '~/trpc/react';

interface NotesListProps {
  notes: MinimalNote[];
  onNoteSelect: (note: MinimalNote) => void;
}

export function NotesList(props: NotesListProps) {
  const { notes: initialNotes, onNoteSelect } = props;

  const { studyId } = useParams<{ studyId: string }>();
  const utils = api.useUtils();

  // Query notes with initialData from server
  const { data: notesData } = api.note.byStudy.useQuery(
    { studyId },
    { initialData: { notes: initialNotes } }
  );

  // Create note mutation
  const createNoteMutation = api.note.create.useMutation({
    onSuccess: (data) => {
      if (data.note) {
        utils.note.byStudy.invalidate({ studyId });
      }
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const handleNewNote = () => {
    createNoteMutation.mutate({
      studyId,
    });
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between py-1.5 pr-2 pl-3">
        <h2 className="pl-2 font-semibold text-md">Notes</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Add new note"
              onClick={handleNewNote}
              className="h-6 w-6 rounded-lg shadow-none"
              disabled={createNoteMutation.isPending}
            >
              {createNoteMutation.isPending ? (
                <Spinner />
              ) : (
                <Plus size={16} strokeWidth={2} aria-hidden="true" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">
            New note
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex min-w-0 flex-shrink flex-col gap-0 overflow-auto pr-2 pb-3 pl-3">
        {notesData.notes.map((note) => (
          <Button
            key={note.id}
            className="group w-full justify-start px-2 py-1"
            variant="ghost"
            size="default"
            onMouseDown={() => onNoteSelect(note)}
          >
            <FilePen
              className="me-2 flex-shrink-0 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            <p className="truncate">{note.title || 'Untitled'}</p>
          </Button>
        ))}
      </div>
    </div>
  );
}
