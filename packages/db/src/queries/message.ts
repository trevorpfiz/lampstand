import 'server-only';

import { and, asc, eq, gte } from 'drizzle-orm';

import { db } from '../client';
import type { NewMessage } from '../schema/message';
import { Message } from '../schema/message';

// read
export async function getMessageById({ id }: { id: string }) {
  const message = await db.query.Message.findFirst({
    where: eq(Message.id, id),
  });

  return { message };
}

export async function getMessagesByChatId({ id }: { id: string }) {
  const messages = await db.query.Message.findMany({
    where: eq(Message.chatId, id),
    orderBy: asc(Message.createdAt),
  });

  return { messages };
}

export async function getFirstMessageByChatId({ id }: { id: string }) {
  const message = await db.query.Message.findFirst({
    where: eq(Message.chatId, id),
    orderBy: asc(Message.createdAt),
  });
  return { message };
}

// create
export async function saveMessages({ messages }: { messages: NewMessage[] }) {
  const savedMessages = await db
    .insert(Message)
    .values(
      messages.map((msg) => ({
        ...msg,
        content: msg.content as any, // TODO: update drizzle-zod when stable
      }))
    )
    .returning();

  return { messages: savedMessages };
}

// delete
export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  const deletedMessages = await db
    .delete(Message)
    .where(and(eq(Message.chatId, chatId), gte(Message.createdAt, timestamp)))
    .returning();

  return { messages: deletedMessages };
}
