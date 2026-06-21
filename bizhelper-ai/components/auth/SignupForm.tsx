"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { signUpAction, type ActionResult } from "@/app/auth/actions";
import { Field, SubmitButton } from "./Field";

export default function SignupForm() {
  const [state, formAction] = useFormState<ActionResult | undefined, FormData>(
    signUpAction,
    undefined
  );
  const router = useRouter();
  const [needsConfirm, setNeedsConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (state?.ok) {
      if (state.message) {
        setNeedsConfirm(state.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }
  }, [state, router]);

  if (needsConfirm) {
    return (
      <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
        {needsConfirm}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Username" name="username" placeholder="Your name or brand" autoComplete="nickname" />
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
        autoComplete="new-password"
        placeholder="At least 8 characters"
      />

      {state?.error && (
        <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-2.5 text-sm text-rose-200">
          {state.error}
        </p>
      )}

      <SubmitButton>Create account</SubmitButton>
    </form>
  );
}
