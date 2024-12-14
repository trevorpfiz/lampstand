import { authRouter } from "./router/auth";
import { feedbackRouter } from "./router/feedback";
import { studyRouter } from "./router/study";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  feedback: feedbackRouter,
  study: studyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
