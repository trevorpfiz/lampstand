import 'server-only';

import { and, desc, eq } from 'drizzle-orm';

import { db } from '../client';
import type { ProfileId, StudyId } from '../schema';
import type { ChatId, ChatVisibility, NewChatParams } from '../schema/chat';
import { Chat } from '../schema/chat';

// read
export async function getChatsByStudyId({
  studyId,
  userId,
}: {
  studyId: StudyId;
  userId: ProfileId;
}) {
  const chats = await db.query.Chat.findMany({
    where: and(eq(Chat.studyId, studyId), eq(Chat.profileId, userId)),
    orderBy: desc(Chat.createdAt),
  });

  return { chats };
}

export async function getChatById({
  chatId,
  userId,
}: {
  chatId: ChatId;
  userId: ProfileId;
}) {
  const chat = await db.query.Chat.findFirst({
    where: and(eq(Chat.id, chatId), eq(Chat.profileId, userId)),
    with: {
      messages: true,
    },
  });

  return { chat };
}

export async function getChatsByUserId({ id }: { id: ProfileId }) {
  const chats = await db.query.Chat.findMany({
    where: eq(Chat.profileId, id),
    orderBy: desc(Chat.createdAt),
  });

  return { chats };
}

// create
export async function createChat({
  newChat,
  userId,
}: {
  newChat: NewChatParams;
  userId: ProfileId;
}) {
  const { studyId, title, visibility } = newChat;
  const [chat] = await db
    .insert(Chat)
    .values({
      studyId,
      title,
      visibility,
      profileId: userId,
    })
    .returning();

  return { chat };
}

// update
export async function updateChatVisiblityById({
  chatId,
  visibility,
  userId,
}: {
  chatId: ChatId;
  visibility: ChatVisibility;
  userId: ProfileId;
}) {
  const [chat] = await db
    .update(Chat)
    .set({ visibility })
    .where(and(eq(Chat.id, chatId), eq(Chat.profileId, userId)))
    .returning();

  return { chat };
}

export async function updateChatTitleById({
  chatId,
  title,
  userId,
}: {
  chatId: ChatId;
  title: string;
  userId: ProfileId;
}) {
  const [chat] = await db
    .update(Chat)
    .set({ title })
    .where(and(eq(Chat.id, chatId), eq(Chat.profileId, userId)))
    .returning();

  return { chat };
}

// delete
export async function deleteChatById({
  chatId,
  userId,
}: {
  chatId: ChatId;
  userId: ProfileId;
}) {
  const [chat] = await db
    .delete(Chat)
    .where(and(eq(Chat.id, chatId), eq(Chat.profileId, userId)))
    .returning();

  return { chat };
}
