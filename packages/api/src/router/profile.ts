import type { TRPCRouterRecord } from '@trpc/server';
import { eq } from 'drizzle-orm';

import { Profile } from '@lamp/db/schema';

import { protectedProcedure } from '../trpc';

export const profileRouter = {
  byUser: protectedProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    const profile = await db.query.Profile.findFirst({
      where: eq(Profile.id, user.id),
    });

    return { profile };
  }),
} satisfies TRPCRouterRecord;
