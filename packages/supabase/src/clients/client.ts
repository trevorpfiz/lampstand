import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "../types";

// export const env = createEnv({
//   clientPrefix: "NEXT_PUBLIC_",
//   client: {
//     NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
//     NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
//   },

//   runtimeEnv: process.env,
//   emptyStringAsUndefined: true,
// });

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
