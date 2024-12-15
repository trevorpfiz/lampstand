import { auth } from "@/auth";
import { and, asc, eq } from "drizzle-orm";

import { db } from "~/db";
import { Message } from "~/db/schema";

export async function getMessagesByChatId(chatId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const messages = await db
    .select()
    .from(Message)
    .where(eq(Message.chatId, chatId))
    .orderBy(asc(Message.createdAt));

  return { messages };
}

export async function deleteMessagesByChatId(chatId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db.delete(Message).where(eq(Message.chatId, chatId));
}

export async function createMessage({
  chatId,
  role,
  content,
}: {
  chatId: string;
  role: string;
  content: any;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [message] = await db
    .insert(Message)
    .values({
      chatId,
      role,
      content,
      createdAt: new Date(),
    })
    .returning();

  return message;
}
