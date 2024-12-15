import { authRouter } from "./router/auth";
import { chatRouter } from "./router/chat";
import { feedbackRouter } from "./router/feedback";
import { studyRouter } from "./router/study";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  chat: chatRouter,
  feedback: feedbackRouter,
  study: studyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
