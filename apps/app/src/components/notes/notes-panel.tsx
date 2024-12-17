"use client";

import { useState } from "react";

import type { MinimalNote } from "@lamp/db/schema";

import { NoteEditor } from "./note-editor";
import { NotesList } from "./notes-list";

interface NotesPanelProps {
  initialNotes?: MinimalNote[];
}

// We only have `id` and `title` for each note at this stage.
// Content is fetched only when a note is selected.
export function NotesPanel({ initialNotes }: NotesPanelProps) {
  const [selectedNote, setSelectedNote] = useState<MinimalNote | null>(null);

  if (selectedNote) {
    return (
      <NoteEditor
        noteId={selectedNote.id}
        onBack={() => setSelectedNote(null)}
      />
    );
  }

  return (
    <NotesList notes={initialNotes ?? []} onNoteSelect={setSelectedNote} />
  );
}
