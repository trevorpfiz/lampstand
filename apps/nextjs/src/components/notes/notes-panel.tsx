"use client";

import { useState } from "react";

import type { Note } from "~/types/notes";
import { NoteEditor } from "./note-editor";
import { NotesList } from "./notes-list";

export function NotesPanel() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  if (selectedNote) {
    return (
      <NoteEditor note={selectedNote} onBack={() => setSelectedNote(null)} />
    );
  }

  return <NotesList onNoteSelect={setSelectedNote} />;
}
