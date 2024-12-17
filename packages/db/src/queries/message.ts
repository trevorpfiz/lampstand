import "server-only";

import { and, asc, eq, gte } from "drizzle-orm";

import type { NewMessage } from "../schema/message";
import { db } from "../client";
import { Message } from "../schema/message";

// read
export async function getMessageById({ id }: { id: string }) {
  try {
    const message = await db.query.Message.findFirst({
      where: eq(Message.id, id),
    });

    return { message };
  } catch (error) {
    console.error("Failed to get message by id from database");
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    const messages = await db.query.Message.findMany({
      where: eq(Message.chatId, id),
      orderBy: asc(Message.createdAt),
    });

    return { messages };
  } catch (error) {
    console.error("Failed to get messages by chat id from database", error);
    throw error;
  }
}

// create
export async function saveMessages({ messages }: { messages: NewMessage[] }) {
  try {
    const savedMessages = await db.insert(Message).values(messages).returning();

    return { messages: savedMessages };
  } catch (error) {
    console.error("Failed to save messages in database", error);
    throw error;
  }
}

// delete
export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const deletedMessages = await db
      .delete(Message)
      .where(and(eq(Message.chatId, chatId), gte(Message.createdAt, timestamp)))
      .returning();

    return { messages: deletedMessages };
  } catch (error) {
    console.error(
      "Failed to delete messages by id after timestamp from database",
    );
    throw error;
  }
}
