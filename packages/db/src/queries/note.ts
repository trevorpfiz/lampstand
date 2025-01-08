import 'server-only';

import { and, desc, eq } from 'drizzle-orm';

import { db } from '../client';
import type { ProfileId, StudyId } from '../schema';
import type { NewNoteParams, NoteId, UpdateNoteParams } from '../schema/note';
import { Note } from '../schema/note';

// read
export async function getNotesByStudyId({
  studyId,
  userId,
}: {
  studyId: StudyId;
  userId: ProfileId;
}) {
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
}

export async function getNoteById({
  noteId,
  userId,
}: {
  noteId: NoteId;
  userId: ProfileId;
}) {
  const note = await db.query.Note.findFirst({
    where: and(eq(Note.id, noteId), eq(Note.profileId, userId)),
  });

  return { note };
}

export async function getNotesByUserId({ id }: { id: ProfileId }) {
  const notes = await db.query.Note.findMany({
    columns: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
    where: eq(Note.profileId, id),
    orderBy: desc(Note.createdAt),
  });

  return { notes };
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
  const [note] = await db
    .update(Note)
    .set(updates)
    .where(and(eq(Note.id, noteId), eq(Note.profileId, userId)))
    .returning();

  return { note };
}

// delete
export async function deleteNoteById({
  noteId,
  userId,
}: {
  noteId: NoteId;
  userId: ProfileId;
}) {
  const [note] = await db
    .delete(Note)
    .where(and(eq(Note.id, noteId), eq(Note.profileId, userId)))
    .returning();

  return { note };
}
