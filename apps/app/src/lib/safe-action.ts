import { captureException } from '@sentry/nextjs';
import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from 'next-safe-action';

import { AuthApiError } from '@lamp/supabase';
import { createClient } from '@lamp/supabase/server';
import { z } from 'zod';

// Base client
export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string().optional(),
    });
  },
  handleServerError(e, utils) {
    const { clientInput, metadata } = utils;

    // Manually log to Sentry - @link https://youtu.be/4IJonW24uck?si=RXwbo33mMyF6eW6D
    captureException(e, (scope) => {
      scope.clear();
      scope.setContext('serverError', { message: e.message });
      scope.setContext('metadata', { actionName: metadata?.actionName });
      scope.setContext('clientInput', { clientInput });
      return scope;
    });

    if (e.constructor.name === 'DatabaseError') {
      return 'Database Error: Your data did not save. Support will be notified.';
    }

    // Convert AuthApiError to MyCustomError
    if (e instanceof AuthApiError) {
      switch (e.code) {
        case 'invalid_credentials':
        case 'user_not_found':
          return 'Invalid email or password';
        case 'email_not_confirmed':
          return 'Please verify your email address';
        default:
          return DEFAULT_SERVER_ERROR_MESSAGE;
      }
    }

    // Every other error will be masked
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

// Auth client
export const authActionClient = actionClient.use(async ({ next }) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error ?? !data.user) {
    throw new Error('Unauthorized');
  }

  return next({ ctx: { supabase, user: data.user } });
});
