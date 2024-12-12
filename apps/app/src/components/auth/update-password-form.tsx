import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";

import type { UpdatePassword } from "@lamp/validators/auth";
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
import { UpdatePasswordSchema } from "@lamp/validators/auth";

import { updatePassword } from "~/lib/actions/auth";

export const UpdatePasswordForm = () => {
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<UpdatePassword>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { execute, status } = useAction(updatePassword, {
    onSuccess: () => {
      setSuccess(true);
      form.reset();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = (values: UpdatePassword) => {
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", {
        message: "Passwords do not match",
      });
      return;
    }
    execute(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={status === "executing"}
                    placeholder="******"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={status === "executing"}
                    placeholder="******"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {success && (
          <div className="text-sm text-green-600">
            Password updated successfully!
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={status === "executing"}
        >
          Update password
        </Button>
      </form>
    </Form>
  );
};
