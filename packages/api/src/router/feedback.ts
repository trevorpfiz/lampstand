import type { TRPCRouterRecord } from "@trpc/server";

import { Feedback, insertFeedbackParams } from "@lamp/db/schema";

import { protectedProcedure } from "../trpc";

export const feedbackRouter = {
  create: protectedProcedure
    .input(insertFeedbackParams)
    .mutation(async ({ ctx, input }) => {
      const { content } = input;
      const profileId = ctx.user.id;

      const feedback = await ctx.db.insert(Feedback).values({
        content,
        profileId,
      });

      return feedback;
    }),
} satisfies TRPCRouterRecord;
