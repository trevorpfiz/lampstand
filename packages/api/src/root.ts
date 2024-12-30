import { authRouter } from './router/auth';
import { chatRouter } from './router/chat';
import { feedbackRouter } from './router/feedback';
import { messageRouter } from './router/message';
import { noteRouter } from './router/note';
import { profileRouter } from './router/profile';
import { stripeRouter } from './router/stripe';
import { studyRouter } from './router/study';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  chat: chatRouter,
  feedback: feedbackRouter,
  message: messageRouter,
  note: noteRouter,
  profile: profileRouter,
  stripe: stripeRouter,
  study: studyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
