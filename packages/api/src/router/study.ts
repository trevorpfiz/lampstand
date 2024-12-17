import type { TRPCRouterRecord } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { insertStudyParams, Study, updateStudyParams } from "@lamp/db/schema";

import { protectedProcedure } from "../trpc";

export const studyRouter = {
  byUser: protectedProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    const studies = await db.query.Study.findMany({
      where: eq(Study.profileId, user.id),
      orderBy: desc(Study.createdAt),
    });

    return { studies };
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { id } = input;

      const study = await db.query.Study.findFirst({
        where: and(eq(Study.id, id), eq(Study.profileId, user.id)),
      });

      return { study };
    }),

  create: protectedProcedure
    .input(insertStudyParams)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { title } = input;

      const [study] = await db
        .insert(Study)
        .values({
          title,
          profileId: user.id,
        })
        .returning();

      return { study };
    }),

  rename: protectedProcedure
    .input(updateStudyParams)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { id, title } = input;

      const [study] = await db
        .update(Study)
        .set({
          title,
        })
        .where(and(eq(Study.id, id), eq(Study.profileId, user.id)))
        .returning();

      return { study };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { id } = input;

      const [study] = await db
        .delete(Study)
        .where(and(eq(Study.id, id), eq(Study.profileId, user.id)))
        .returning();

      return { study };
    }),
} satisfies TRPCRouterRecord;
