"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { updatePasswordAction, type ActionResult } from "@/app/auth/actions";
import { Field, SubmitButton } from "./Field";

export default function ResetForm() {
  const [state, formAction] = useFormState<ActionResult | undefined, FormData>(
    updatePasswordAction,
    undefined
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.ok) {
      const t = setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        label="New password"
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
      {state?.ok && state.message && (
        <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-200">
          {state.message}
        </p>
      )}
      <SubmitButton>Update password</SubmitButton>
    </form>
  );
}
