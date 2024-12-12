import { createEnv } from "@t3-oss/env-core";
import { Resend } from "resend";
import { z } from "zod";

export const env = createEnv({
  server: {
    RESEND_TOKEN: z.string(),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export const resend = new Resend(env.RESEND_TOKEN);
