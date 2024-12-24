import type { TRPCRouterRecord } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { getMessagesByChatId, saveMessages } from '@lamp/db/queries';
import { Chat, Message, insertMessageParams } from '@lamp/db/schema';

import { protectedProcedure } from '../trpc';

export const messageRouter = {
  byChatId: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { chatId } = input;

      // First verify the chat belongs to the user
      const chat = await db.query.Chat.findFirst({
        where: and(eq(Chat.id, chatId), eq(Chat.profileId, user.id)),
      });

      if (!chat) {
        throw new Error('Chat not found');
      }

      const { messages } = await getMessagesByChatId({ id: chatId });
      return { messages };
    }),

  saveMessages: protectedProcedure
    .input(
      z.object({
        messages: z.array(insertMessageParams),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { messages } = input;

      // Verify all chats belong to user
      const chatIds = [...new Set(messages.map((m) => m.chatId))];
      const chats = await db.query.Chat.findMany({
        where: and(
          eq(Chat.profileId, user.id),
          // Using SQL 'in' operator would be better here
          ...chatIds.map((id) => eq(Chat.id, id))
        ),
      });

      if (chats.length !== chatIds.length) {
        throw new Error('One or more chats not found or unauthorized');
      }

      const { messages: savedMessages } = await saveMessages({
        messages,
      });

      return { messages: savedMessages };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { id } = input;

      // Verify message belongs to user's chat
      const message = await db.query.Message.findFirst({
        where: eq(Message.id, id),
        with: {
          chat: true,
        },
      });

      if (!message || message.chat.profileId !== user.id) {
        throw new Error('Message not found');
      }

      const [deletedMessage] = await db
        .delete(Message)
        .where(eq(Message.id, id))
        .returning();

      return { message: deletedMessage };
    }),
} satisfies TRPCRouterRecord;
