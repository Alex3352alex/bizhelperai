"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInAction, type ActionResult } from "@/app/auth/actions";
import { Field, SubmitButton } from "./Field";

export default function LoginForm() {
  const [state, formAction] = useFormState<ActionResult | undefined, FormData>(
    signInAction,
    undefined
  );
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (state?.ok) {
      const redirect = params.get("redirect") || "/dashboard";
      router.push(redirect);
      router.refresh();
    }
  }, [state, router, params]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@business.com"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
      />

      <div className="-mt-1 text-right">
        <Link
          href="/forgot-password"
          className="text-xs text-ink-muted transition-colors hover:text-ink"
        >
          Forgot password?
        </Link>
      </div>

      {state?.error && (
        <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-2.5 text-sm text-rose-200">
          {state.error}
        </p>
      )}

      <SubmitButton>Sign in</SubmitButton>
    </form>
  );
}
