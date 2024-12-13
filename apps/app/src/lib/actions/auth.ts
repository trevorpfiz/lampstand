"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@lamp/supabase/server";
import {
  RequestPasswordResetSchema,
  SignInSchema,
  SignUpSchema,
  UpdatePasswordSchema,
} from "@lamp/validators/auth";

import { DEFAULT_LOGIN_REDIRECT, RESET_PASSWORD_ROUTE } from "~/config/routes";
import { actionClient } from "~/lib/safe-action";

export const signInWithPassword = actionClient
  .schema(SignInSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    revalidatePath("/", "layout");
  });

export const signUp = actionClient
  .schema(SignUpSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const supabase = await createClient();
    const headersList = await headers();

    const origin = headersList.get("origin");
    const redirectUrl = `${origin}/auth/confirm?next=${encodeURIComponent(DEFAULT_LOGIN_REDIRECT)}`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    // User already exists, so fake data is returned. See https://supabase.com/docs/reference/javascript/auth-signup
    if (data.user?.identities && data.user.identities.length === 0) {
      throw new Error("An error occurred. Please try again.");
    }

    if (error) {
      throw error;
    }

    revalidatePath("/", "layout");
    return data.user;
  });

export const resetPassword = actionClient
  .schema(RequestPasswordResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(RESET_PASSWORD_ROUTE)}`,
    });

    if (error) {
      throw error;
    }

    revalidatePath("/", "layout");
    return data;
  });

export const updatePassword = actionClient
  .schema(UpdatePasswordSchema)
  .action(async ({ parsedInput: { newPassword } }) => {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    revalidatePath("/", "layout");
    return data.user;
  });

export const signInWithGithub = async () => {
  const supabase = await createClient();
  const headersList = await headers();

  const origin = headersList.get("origin");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (data.url) {
    redirect(data.url);
  }
  if (error) {
    console.error(error.message);
    redirect("/auth/error");
  }
};

export const signInWithGoogle = async () => {
  const supabase = await createClient();
  const headersList = await headers();

  const origin = headersList.get("origin");
  const redirectUrl = `${origin}/auth/callback?next=${encodeURIComponent(DEFAULT_LOGIN_REDIRECT)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: redirectUrl },
  });

  if (data.url) {
    redirect(data.url);
  }
  if (error) {
    console.error(error.message);
    redirect("/auth/error");
  }
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  // redirect("/");
};
