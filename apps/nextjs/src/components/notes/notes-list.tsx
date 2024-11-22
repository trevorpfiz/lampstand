"use client";

import { MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@lamp/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@lamp/ui/dropdown-menu";

import type { Note } from "~/types/notes";

interface NotesListProps {
  onNoteSelect: (note: Note) => void;
}

export function NotesList({ onNoteSelect }: NotesListProps) {
  // This would normally come from your database/state management
  const notes: Note[] = [
    {
      id: "1",
      title: "First Note",
      content: "This is my first note",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Add more mock notes as needed
  ];

  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onNoteSelect(newNote);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h2 className="text-lg font-semibold">Notes</h2>
        <Button
          onClick={handleNewNote}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex items-center justify-between border-b px-4 py-2 hover:bg-muted/50"
            role="button"
            onClick={() => onNoteSelect(note)}
          >
            <div>
              <h3 className="font-medium">{note.title}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Delete</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
}
