import "server-only";

import { and, desc, eq } from "drizzle-orm";

import type { ProfileId } from "../schema";
import type {
  NewStudyParams,
  StudyId,
  UpdateStudyParams,
} from "../schema/study";
import { db } from "../client";
import { Study } from "../schema/study";

// read
export async function getStudiesByUserId({ id }: { id: ProfileId }) {
  try {
    const studies = await db.query.Study.findMany({
      where: eq(Study.profileId, id),
      orderBy: desc(Study.createdAt),
    });

    return { studies };
  } catch (error) {
    console.error("Failed to get studies by user from database");
    throw error;
  }
}

export async function getStudyById({
  studyId,
  userId,
}: {
  studyId: StudyId;
  userId: ProfileId;
}) {
  try {
    const study = await db.query.Study.findFirst({
      where: and(eq(Study.id, studyId), eq(Study.profileId, userId)),
    });

    return { study };
  } catch (error) {
    console.error("Failed to get study by id from database");
    throw error;
  }
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

  try {
    const [study] = await db
      .insert(Study)
      .values({
        title,
        profileId: userId,
      })
      .returning();

    return { study };
  } catch (error) {
    console.error("Failed to create study in database");
    throw error;
  }
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

  try {
    const [study] = await db
      .update(Study)
      .set({ title })
      .where(and(eq(Study.id, studyId), eq(Study.profileId, userId)))
      .returning();

    return { study };
  } catch (error) {
    console.error("Failed to update study in database");
    throw error;
  }
}

// delete
export async function deleteStudyById({
  studyId,
  userId,
}: {
  studyId: StudyId;
  userId: ProfileId;
}) {
  try {
    const [study] = await db
      .delete(Study)
      .where(and(eq(Study.id, studyId), eq(Study.profileId, userId)))
      .returning();

    return { study };
  } catch (error) {
    console.error("Failed to delete study from database");
    throw error;
  }
}
