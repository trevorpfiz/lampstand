import { AuthApiError } from "@supabase/supabase-js";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";

import { createClient } from "@lamp/supabase/server";

// Base client
export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);

    // Convert AuthApiError to MyCustomError
    if (e instanceof AuthApiError) {
      switch (e.code) {
        case "invalid_credentials":
        case "user_not_found":
          return "Invalid email or password";
        case "email_not_confirmed":
          return "Please verify your email address";
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
    throw new Error("Unauthorized");
  }

  return next({ ctx: { supabase, user: data.user } });
});
