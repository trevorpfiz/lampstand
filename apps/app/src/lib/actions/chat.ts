"use server";

import type { Message } from "ai";
import { auth } from "@/auth";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "~/db";
import { Chat, Message as DbMessage } from "~/db/schema";
import { generateUUID } from "~/lib/utils";

export async function createChat({
  studyId,
  messages,
}: {
  studyId: string;
  messages: Message[];
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const chatId = generateUUID();

  // Create chat
  await db.insert(Chat).values({
    id: chatId,
    profileId: session.user.id,
    studyId,
    title: messages[0]?.content ?? "New Chat",
    visibility: "private",
  });

  // Create messages
  await db.insert(DbMessage).values(
    messages.map((message) => ({
      id: generateUUID(),
      chatId,
      role: message.role,
      content: message.content,
      createdAt: new Date(),
    })),
  );

  return chatId;
}

export async function updateChat({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Create new messages
  await db.insert(DbMessage).values(
    messages.map((message) => ({
      id: generateUUID(),
      chatId: id,
      role: message.role,
      content: message.content,
      createdAt: new Date(),
    })),
  );

  return id;
}

export async function deleteChat(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db.delete(Chat).where(eq(Chat.id, id));
}

export async function updateChatVisibility({
  id,
  visibility,
}: {
  id: string;
  visibility: "public" | "private";
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db.update(Chat).set({ visibility }).where(eq(Chat.id, id));
}

export async function getChatsByStudy(studyId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const chats = await db.query.Chat.findMany({
    where: and(eq(Chat.studyId, studyId), eq(Chat.profileId, session.user.id)),
    orderBy: desc(Chat.createdAt),
  });

  return { chats };
}

export async function getChatById(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const chat = await db.query.Chat.findFirst({
    where: and(eq(Chat.id, id), eq(Chat.profileId, session.user.id)),
  });

  return { chat };
}
