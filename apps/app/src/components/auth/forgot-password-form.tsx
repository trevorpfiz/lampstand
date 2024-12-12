import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { resetPassword } from "~/lib/actions/auth";

export const ForgotPasswordForm = () => {
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<RequestPasswordReset>({
    resolver: zodResolver(RequestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, status } = useAction(resetPassword, {
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
      <div className="flex w-full items-center justify-center">
        <p className="text-sm text-muted-foreground">
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={status === "executing"}
                    placeholder="john.doe@example.com"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={status === "executing"}
        >
          Send reset link
        </Button>
      </form>
    </Form>
  );
};
