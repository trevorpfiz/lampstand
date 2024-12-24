import 'server-only';

import { and, desc, eq } from 'drizzle-orm';

import { db } from '../client';
import type { ProfileId } from '../schema';
import type {
  NewStudyParams,
  StudyId,
  UpdateStudyParams,
} from '../schema/study';
import { Study } from '../schema/study';

// read
export async function getStudiesByUserId({ id }: { id: ProfileId }) {
  const studies = await db.query.Study.findMany({
    where: eq(Study.profileId, id),
    orderBy: desc(Study.createdAt),
  });

  return { studies };
}

export async function getStudyById({
  studyId,
  userId,
}: {
  studyId: StudyId;
  userId: ProfileId;
}) {
  const study = await db.query.Study.findFirst({
    where: and(eq(Study.id, studyId), eq(Study.profileId, userId)),
  });

  return { study };
}

// create
export async function createStudy({
  newStudy,
  userId,
}: {
  newStudy: NewStudyParams;
  userId: ProfileId;
}) {
  const { title } = newStudy;
  const [study] = await db
    .insert(Study)
    .values({
      title,
      profileId: userId,
    })
    .returning();

  return { study };
}

// update
export async function updateStudyById({
  studyId,
  updates,
  userId,
}: {
  studyId: StudyId;
  updates: UpdateStudyParams;
  userId: ProfileId;
}) {
  const { title } = updates;
  const [study] = await db
    .update(Study)
    .set({ title })
    .where(and(eq(Study.id, studyId), eq(Study.profileId, userId)))
    .returning();

  return { study };
}

// delete
export async function deleteStudyById({
  studyId,
  userId,
}: {
  studyId: StudyId;
  userId: ProfileId;
}) {
  const [study] = await db
    .delete(Study)
    .where(and(eq(Study.id, studyId), eq(Study.profileId, userId)))
    .returning();

  return { study };
}
