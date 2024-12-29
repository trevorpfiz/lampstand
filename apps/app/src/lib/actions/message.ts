import { z } from 'zod';

import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
} from '@lamp/db/queries';

import { flattenValidationErrors } from 'next-safe-action';
import { actionClient } from '~/lib/safe-action';

export const deleteTrailingMessages = actionClient
  .metadata({ actionName: 'deleteTrailingMessages' })
  .schema(z.object({ id: z.string() }), {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
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
