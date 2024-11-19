"use client";

import Link from "next/link";
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
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isExecuting}
                    placeholder="Email address"
                    type="email"
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
                <div className="flex items-center pt-1">
                  <FormLabel className="pb-1">Password</FormLabel>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isExecuting}
                    placeholder="Password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormError message={result.serverError} />

        <Button disabled={isExecuting} type="submit" className="w-full">
          Continue with Email
        </Button>
      </form>
    </Form>
  );
};
