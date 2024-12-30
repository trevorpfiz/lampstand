import type { TRPCRouterRecord } from '@trpc/server';
import { and, eq } from 'drizzle-orm';

import { Subscription } from '@lamp/db/schema';

import { protectedProcedure } from '../trpc';

export const stripeRouter = {
  getActiveSubscriptionByUser: protectedProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    const subscription = await db.query.Subscription.findFirst({
      where: and(
        eq(Subscription.userId, user.id),
        eq(Subscription.status, 'active')
      ),
      with: {
        price: {
          with: {
            product: true,
          },
        },
      },
    });

    return { subscription };
  }),
} satisfies TRPCRouterRecord;
