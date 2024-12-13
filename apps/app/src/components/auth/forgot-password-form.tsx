"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CircleCheck } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";

import type { RequestPasswordReset } from "@lamp/validators/auth";
import { Button } from "@lamp/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@lamp/ui/form";
import { Input } from "@lamp/ui/input";
import { RequestPasswordResetSchema } from "@lamp/validators/auth";

import { FormError } from "~/components/auth/form-error";
import { resetPassword } from "~/lib/actions/auth";

export const ForgotPasswordForm = () => {
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<RequestPasswordReset>({
    resolver: zodResolver(RequestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, result, isExecuting } = useAction(resetPassword, {
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = (values: RequestPasswordReset) => {
    execute(values);
  };

  if (success) {
    return (
      <div className="border-eborder rounded-lg border px-4 py-3">
        <p className="text-sm">
          <CircleCheck
            className="-mt-0.5 me-3 inline-flex text-emerald-500"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          Check your email for a password reset link.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-[13px] leading-snug">
                    Email address
                  </FormLabel>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isExecuting}
                    type="email"
                    className="h-8"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormError message={result.serverError} />

        <Button
          className="group w-full text-[13px] leading-snug"
          size="sm"
          type="submit"
          disabled={isExecuting}
        >
          Send reset link
          <ArrowRight
            className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
            size={13}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
      </form>
    </Form>
  );
};
