"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

import type { SignUp } from "@lamp/validators/auth";
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
import { SignUpSchema } from "@lamp/validators/auth";

import { FormError } from "~/components/auth/form-error";
import { FormSuccess } from "~/components/auth/form-success";
import { signUp } from "~/lib/actions/auth";

export const SignUpForm = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const form = useForm({
    schema: SignUpSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, result, isExecuting, hasSucceeded } = useAction(signUp);

  useEffect(() => {
    if (hasSucceeded) {
      form.reset();
    }
  }, [hasSucceeded, form]);

  const onSubmit = (values: SignUp) => {
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

        {hasSucceeded && (
          <FormSuccess message={"Confirmation email has been sent!"} />
        )}
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
