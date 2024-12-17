import "server-only";

import { and, desc, eq } from "drizzle-orm";

import type { ProfileId, StudyId } from "../schema";
import type { ChatId, ChatVisibility, NewChatParams } from "../schema/chat";
import { db } from "../client";
import { Chat } from "../schema/chat";

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
    with: {
      messages: true,
    },
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
  try {
    const chat = await db.query.Chat.findFirst({
      where: and(eq(Chat.id, chatId), eq(Chat.profileId, userId)),
      with: {
        messages: true,
      },
    });

    return { chat };
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: ProfileId }) {
  try {
    const chats = await db.query.Chat.findMany({
      where: eq(Chat.profileId, id),
      orderBy: desc(Chat.createdAt),
    });

    return { chats };
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
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

  try {
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
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
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
  try {
    const [chat] = await db
      .update(Chat)
      .set({ visibility })
      .where(and(eq(Chat.id, chatId), eq(Chat.profileId, userId)))
      .returning();

    return { chat };
  } catch (error) {
    console.error("Failed to update chat visibility in database");
    throw error;
  }
}

// delete
export async function deleteChatById({
  chatId,
  userId,
}: {
  chatId: ChatId;
  userId: ProfileId;
}) {
  try {
    const [chat] = await db
      .delete(Chat)
      .where(and(eq(Chat.id, chatId), eq(Chat.profileId, userId)))
      .returning();

    return { chat };
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}
