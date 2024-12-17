import "server-only";

import { and, desc, eq } from "drizzle-orm";

import type { ProfileId, StudyId } from "../schema";
import type { NewNoteParams, NoteId, UpdateNoteParams } from "../schema/note";
import { db } from "../client";
import { Note } from "../schema/note";

// read
export async function getNotesByStudyId({
  studyId,
  userId,
}: {
  studyId: StudyId;
  userId: ProfileId;
}) {
  try {
    const notes = await db.query.Note.findMany({
      columns: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
      where: and(eq(Note.studyId, studyId), eq(Note.profileId, userId)),
      orderBy: desc(Note.createdAt),
    });

    return { notes };
  } catch (error) {
    console.error("Failed to get notes by study from database");
    throw error;
  }
}

export async function getNoteById({
  noteId,
  userId,
}: {
  noteId: NoteId;
  userId: ProfileId;
}) {
  try {
    const note = await db.query.Note.findFirst({
      where: and(eq(Note.id, noteId), eq(Note.profileId, userId)),
    });

    return { note };
  } catch (error) {
    console.error("Failed to get note by id from database");
    throw error;
  }
}

export async function getNotesByUserId({ id }: { id: ProfileId }) {
  try {
    const notes = await db.query.Note.findMany({
      where: eq(Note.profileId, id),
      orderBy: desc(Note.createdAt),
    });

    return { notes };
  } catch (error) {
    console.error("Failed to get notes by user from database");
    throw error;
  }
}

// create
export async function createNote({
  newNote,
  studyId,
  userId,
}: {
  newNote: NewNoteParams;
  studyId: StudyId;
  userId: ProfileId;
}) {
  const { title, content } = newNote;

  try {
    const [note] = await db
      .insert(Note)
      .values({
        title,
        content,
        studyId,
        profileId: userId,
      })
      .returning();

    return { note };
  } catch (error) {
    console.error("Failed to create note in database");
    throw error;
  }
}

// update
export async function updateNoteById({
  noteId,
  updates,
  userId,
}: {
  noteId: NoteId;
  updates: UpdateNoteParams;
  userId: ProfileId;
}) {
  try {
    const [note] = await db
      .update(Note)
      .set(updates)
      .where(and(eq(Note.id, noteId), eq(Note.profileId, userId)))
      .returning();

    return { note };
  } catch (error) {
    console.error("Failed to update note in database");
    throw error;
  }
}

// delete
export async function deleteNoteById({
  noteId,
  userId,
}: {
  noteId: NoteId;
  userId: ProfileId;
}) {
  try {
    const [note] = await db
      .delete(Note)
      .where(and(eq(Note.id, noteId), eq(Note.profileId, userId)))
      .returning();

    return { note };
  } catch (error) {
    console.error("Failed to delete note from database");
    throw error;
  }
}
