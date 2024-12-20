import type { TRPCRouterRecord } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { insertNoteParams, Note, updateNoteParams } from "@lamp/db/schema";

import { protectedProcedure } from "../trpc";

export const noteRouter = {
  byStudy: protectedProcedure
    .input(z.object({ studyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { studyId } = input;

      const notes = await db.query.Note.findMany({
        columns: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
        where: and(eq(Note.studyId, studyId), eq(Note.profileId, user.id)),
        orderBy: desc(Note.createdAt),
      });

      return { notes };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { id } = input;

      const note = await db.query.Note.findFirst({
        where: and(eq(Note.id, id), eq(Note.profileId, user.id)),
      });

      return { note };
    }),

  byUser: protectedProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    const notes = await db.query.Note.findMany({
      where: eq(Note.profileId, user.id),
      orderBy: desc(Note.createdAt),
    });

    return { notes };
  }),

  create: protectedProcedure
    .input(
      insertNoteParams.extend({
        studyId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { studyId, title, content } = input;

      const [note] = await db
        .insert(Note)
        .values({
          studyId,
          title,
          content: content,
          profileId: user.id,
        })
        .returning();

      return { note };
    }),

  update: protectedProcedure
    .input(updateNoteParams)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { id, ...updates } = input;

      const [note] = await db
        .update(Note)
        .set(updates)
        .where(and(eq(Note.id, id), eq(Note.profileId, user.id)))
        .returning();

      return { note };
    }),

  rename: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { id, title } = input;

      const [note] = await db
        .update(Note)
        .set({ title })
        .where(and(eq(Note.id, id), eq(Note.profileId, user.id)))
        .returning();

      return { note };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { id } = input;

      const [note] = await db
        .delete(Note)
        .where(and(eq(Note.id, id), eq(Note.profileId, user.id)))
        .returning();

      return { note };
    }),
} satisfies TRPCRouterRecord;
