import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./db";

export type Client = SupabaseClient<Database>;

export * from "./db";

export type { User } from "@supabase/supabase-js";
