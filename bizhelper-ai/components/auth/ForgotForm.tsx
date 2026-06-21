"use client";

import { useFormState } from "react-dom";
import { forgotPasswordAction, type ActionResult } from "@/app/auth/actions";
import { Field, SubmitButton } from "./Field";

export default function ForgotForm() {
  const [state, formAction] = useFormState<ActionResult | undefined, FormData>(
    forgotPasswordAction,
    undefined
  );

  if (state?.ok && state.message) {
    return (
      <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@business.com"
      />
      {state?.error && (
        <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-2.5 text-sm text-rose-200">
          {state.error}
        </p>
      )}
      <SubmitButton>Send reset link</SubmitButton>
    </form>
  );
}
