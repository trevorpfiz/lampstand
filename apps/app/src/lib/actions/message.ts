import { z } from 'zod';

import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
} from '@lamp/db/queries';

import { actionClient } from '~/lib/safe-action';

export const deleteTrailingMessages = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    const { message } = await getMessageById({ id });

    if (!message) {
      throw new Error('Message not found');
    }

    await deleteMessagesByChatIdAfterTimestamp({
      chatId: message.chatId,
      timestamp: message.createdAt,
    });
  });
