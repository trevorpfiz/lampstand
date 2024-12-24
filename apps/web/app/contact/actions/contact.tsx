"use server";

import { headers } from "next/headers";

import { resend } from "@lamp/email";
import { ContactTemplate } from "@lamp/email/templates/contact";
import { env } from "@lamp/env";
import { parseError } from "@lamp/observability/error";
import { createRateLimiter, slidingWindow } from "@lamp/rate-limit";

export const contact = async (
  name: string,
  email: string,
  message: string,
): Promise<{
  error?: string;
}> => {
  try {
    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      const rateLimiter = createRateLimiter({
        limiter: slidingWindow(1, "1d"),
      });
      const head = await headers();
      const ip = head.get("x-forwarded-for");

      const { success } = await rateLimiter.limit(`contact_form_${ip}`);

      if (!success) {
        throw new Error(
          "You have reached your request limit. Please try again later.",
        );
      }
    }

    await resend.emails.send({
      from: env.RESEND_FROM,
      to: env.RESEND_FROM,
      subject: "Contact form submission",
      replyTo: email,
      react: <ContactTemplate name={name} email={email} message={message} />,
    });

    return {};
  } catch (error) {
    const errorMessage = parseError(error);

    return { error: errorMessage };
  }
};
