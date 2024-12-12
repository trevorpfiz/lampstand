import { createBrowserClient } from "@supabase/ssr";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import type { Database } from "../types";

export const env = createEnv({
  server: {
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
