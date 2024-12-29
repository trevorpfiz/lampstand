'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  DEFAULT_LOGIN_REDIRECT,
  RESET_PASSWORD_ROUTE,
} from '@lamp/supabase/config/routes';
import { createClient } from '@lamp/supabase/server';
import {
  RequestPasswordResetSchema,
  SignInSchema,
  SignUpSchema,
  UpdatePasswordSchema,
} from '@lamp/validators/auth';

import { flattenValidationErrors } from 'next-safe-action';
import { actionClient } from '~/lib/safe-action';

export const signInWithPassword = actionClient
  .metadata({ actionName: 'signInWithPassword' })
  .schema(SignInSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { email, password } }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    revalidatePath('/', 'layout');
    redirect('/');
  });

export const signUp = actionClient
  .metadata({ actionName: 'signUp' })
  .schema(SignUpSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { email, password } }) => {
    const supabase = await createClient();
    const headersList = await headers();

    const origin = headersList.get('origin');
    const redirectUrl = `${origin}/auth/confirm?next=${encodeURIComponent(
      DEFAULT_LOGIN_REDIRECT
    )}`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          stripe_customer_id: '',
        },
      },
    });

    // User already exists, so fake data is returned. See https://supabase.com/docs/reference/javascript/auth-signup
    if (data.user?.identities && data.user.identities.length === 0) {
      throw new Error('An error occurred. Please try again.');
    }

    if (error) {
      throw error;
    }

    revalidatePath('/', 'layout');
    return data.user;
  });

export const requestResetPassword = actionClient
  .metadata({ actionName: 'requestResetPassword' })
  .schema(RequestPasswordResetSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { email } }) => {
    const supabase = await createClient();
    const headersList = await headers();

    const origin = headersList.get('origin');
    const redirectUrl = `${origin}/auth/confirm?next=${encodeURIComponent(
      RESET_PASSWORD_ROUTE
    )}`;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      throw error;
    }

    revalidatePath('/', 'layout');
    return data;
  });

export const updatePassword = actionClient
  .metadata({ actionName: 'updatePassword' })
  .schema(UpdatePasswordSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { newPassword } }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    revalidatePath('/', 'layout');
    redirect('/');
  });

export const signInWithGithub = async () => {
  const supabase = await createClient();
  const headersList = await headers();

  const origin = headersList.get('origin');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (data.url) {
    redirect(data.url);
  }
  if (error) {
    redirect('/auth/error');
  }
};

export const signInWithGoogle = async () => {
  const supabase = await createClient();
  const headersList = await headers();

  const origin = headersList.get('origin');
  const redirectUrl = `${origin}/auth/callback?next=${encodeURIComponent(DEFAULT_LOGIN_REDIRECT)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl },
  });

  if (data.url) {
    redirect(data.url);
  }
  if (error) {
    redirect('/auth/error');
  }
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
};
