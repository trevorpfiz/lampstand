"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Eye, EyeOff, X } from "lucide-react";
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

import { FormError } from "~/components/auth/form-error";
import { updatePassword } from "~/lib/actions/auth";

export const UpdatePasswordForm = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const form = useForm<UpdatePassword>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const { execute, result, isExecuting } = useAction(updatePassword);

  const onSubmit = (values: UpdatePassword) => {
    execute(values);
  };

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(form.watch("newPassword"));

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-[13px] leading-snug">
                    New Password
                  </FormLabel>
                </div>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      className="h-8 pe-9"
                      disabled={isExecuting}
                      placeholder="Password"
                      type={isVisible ? "text" : "password"}
                      aria-invalid={strengthScore < 4}
                      aria-describedby="password-strength"
                    />
                  </FormControl>
                  <button
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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
                <FormMessage />

                {/* Password strength indicator */}
                <div
                  className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
                  role="progressbar"
                  aria-valuenow={strengthScore}
                  aria-valuemin={0}
                  aria-valuemax={4}
                  aria-label="Password strength"
                >
                  <div
                    className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                    style={{ width: `${(strengthScore / 4) * 100}%` }}
                  ></div>
                </div>

                {/* Password strength description */}
                <p
                  id="password-strength"
                  className="mb-2 text-[13px] font-medium leading-snug text-foreground"
                >
                  {getStrengthText(strengthScore)}. Must contain:
                </p>

                {/* Password requirements list */}
                <ul className="space-y-1.5" aria-label="Password requirements">
                  {strength.map((req, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {req.met ? (
                        <Check
                          size={16}
                          strokeWidth={2}
                          className="text-emerald-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <X
                          size={16}
                          strokeWidth={2}
                          className="text-muted-foreground/80"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
                      >
                        {req.text}
                        <span className="sr-only">
                          {req.met
                            ? " - Requirement met"
                            : " - Requirement not met"}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </FormItem>
            )}
          />
        </div>

        <FormError message={result.serverError} />

        <Button
          className="group w-full text-[13px] leading-snug"
          size="sm"
          type="submit"
          disabled={isExecuting || strengthScore < 4}
        >
          Update password
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
