import type { TRPCRouterRecord } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { Chat, chatVisibilitySchema, insertChatParams } from "@lamp/db/schema";

import { protectedProcedure } from "../trpc";

export const chatRouter = {
  byStudy: protectedProcedure
    .input(z.object({ studyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { studyId } = input;

      const chats = await db.query.Chat.findMany({
        where: and(eq(Chat.studyId, studyId), eq(Chat.profileId, user.id)),
        orderBy: desc(Chat.createdAt),
      });

      return { chats };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { id } = input;

      const chat = await db.query.Chat.findFirst({
        where: and(eq(Chat.id, id), eq(Chat.profileId, user.id)),
        with: {
          messages: true,
        },
      });

      return { chat };
    }),

  byUser: protectedProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    const chats = await db.query.Chat.findMany({
      where: eq(Chat.profileId, user.id),
      orderBy: desc(Chat.createdAt),
    });

    return { chats };
  }),

  create: protectedProcedure
    .input(insertChatParams)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { studyId, title, visibility } = input;

      const [chat] = await db
        .insert(Chat)
        .values({
          studyId,
          title,
          visibility,
          profileId: user.id,
        })
        .returning();

      return { chat };
    }),

  updateVisibility: protectedProcedure
    .input(chatVisibilitySchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { id, visibility } = input;

      const [chat] = await db
        .update(Chat)
        .set({
          visibility,
        })
        .where(and(eq(Chat.id, id), eq(Chat.profileId, user.id)))
        .returning();

      return { chat };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { id } = input;

      const [chat] = await db
        .delete(Chat)
        .where(and(eq(Chat.id, id), eq(Chat.profileId, user.id)))
        .returning();

      return { chat };
    }),
} satisfies TRPCRouterRecord;
