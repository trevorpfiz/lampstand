'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import type { CoreUserMessage } from '@lamp/ai';
import { customModel, generateText } from '@lamp/ai';
import { updateChatVisiblityById } from '@lamp/db/queries';
import { chatIdSchema, chatVisibilitySchema } from '@lamp/db/schema';
import { createClient } from '@lamp/supabase/server';

import { flattenValidationErrors } from 'next-safe-action';
import { actionClient } from '~/lib/safe-action';

export const saveModelId = actionClient
  .metadata({ actionName: 'saveModelId' })
  .schema(z.object({ model: z.string() }), {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { model } }) => {
    const cookieStore = await cookies();
    cookieStore.set('model-id', model);
  });

export async function generateTitleFromUserMessage({
  message,
}: {
  message: CoreUserMessage;
}) {
  const { text: title } = await generateText({
    model: customModel('gpt-4o-mini'),
    system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export const updateChatVisibility = actionClient
  .metadata({ actionName: 'updateChatVisibility' })
  .schema(z.intersection(chatIdSchema, chatVisibilitySchema), {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id, visibility } }) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    await updateChatVisiblityById({
      chatId: id,
      visibility,
      userId: user.id,
    });
  });
