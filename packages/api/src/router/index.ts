import { createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { feedbackRouter } from "./feedback";
import { studyRouter } from "./study";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  feedback: feedbackRouter,
  study: studyRouter,
});

export type AppRouter = typeof appRouter;
