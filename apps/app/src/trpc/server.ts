import { cache } from "react";
import { headers } from "next/headers";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import type { AppRouter } from "@lamp/api";
import { createCaller, createTRPCContext } from "@lamp/api";
import { createClient } from "@lamp/supabase/server";

import { createQueryClient } from "~/trpc/query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const headersList = await headers();
  const heads = new Headers(headersList);
  heads.set("x-trpc-source", "rsc");

  const supabase = await createClient();

  return createTRPCContext({
    headers: heads,
    supabase,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
