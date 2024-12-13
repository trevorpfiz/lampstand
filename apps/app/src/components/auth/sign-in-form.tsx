"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

import type { SignIn } from "@lamp/validators/auth";
import { Button } from "@lamp/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@lamp/ui/form";
import { Input } from "@lamp/ui/input";
import { SignInSchema } from "@lamp/validators/auth";

import { FormError } from "~/components/auth/form-error";
import { signInWithPassword } from "~/lib/actions/auth";

export const SignInForm = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const form = useForm({
    schema: SignInSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, result, isExecuting } = useAction(signInWithPassword);

  const onSubmit = (values: SignIn) => {
    execute(values);
  };

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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-[13px] leading-snug">
                    Password
                  </FormLabel>
                  <Link
                    href="/forgot-password"
                    className="inline-block text-[13px] leading-snug underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={isExecuting}
                      type={isVisible ? "text" : "password"}
                      className="h-8 pe-9"
                    />
                    <button
                      className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      onClick={() => setIsVisible(!isVisible)}
                      aria-label={isVisible ? "Hide password" : "Show password"}
                      aria-pressed={isVisible}
                    >
                      {isVisible ? (
                        <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                      ) : (
                        <Eye size={16} strokeWidth={2} aria-hidden="true" />
                      )}
                    </button>
                  </div>
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
          Continue with Email
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
