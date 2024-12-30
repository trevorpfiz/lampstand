import 'server-only';

import { eq, sql } from 'drizzle-orm';

import { db } from '../client';
import { Profile } from '../schema/profile';

// read
export async function getProfileById({ id }: { id: string }) {
  const profile = await db.query.Profile.findFirst({
    where: eq(Profile.id, id),
  });
  return { profile };
}

// update
export async function incrementLlmUsage({
  userId,
  amount,
  premium,
}: {
  userId: string;
  amount: number;
  premium: boolean;
}) {
  if (premium) {
    await db
      .update(Profile)
      .set({
        premiumLlmUsage: sql`${Profile.premiumLlmUsage} + ${amount}`,
      })
      .where(eq(Profile.id, userId));
  } else {
    await db
      .update(Profile)
      .set({
        llmUsage: sql`${Profile.llmUsage} + ${amount}`,
      })
      .where(eq(Profile.id, userId));
  }
}
