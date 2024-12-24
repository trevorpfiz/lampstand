import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

// biome-ignore lint/nursery/noExportedImports: <explanation>
import type { AppRouter } from './root';
// biome-ignore lint/nursery/noExportedImports: <explanation>
import { appRouter } from './root';
import { createCallerFactory } from './trpc';

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.Post.all();
 *       ^? Post[]
 */
const createCaller = createCallerFactory(appRouter);

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { appRouter, createCaller };
export type { AppRouter, RouterInputs, RouterOutputs };
export { createTRPCContext } from './trpc';
