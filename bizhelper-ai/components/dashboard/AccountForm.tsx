"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { updateUsernameAction } from "@/app/dashboard/account/actions";
import type { ActionResult } from "@/app/auth/actions";
import { Field, SubmitButton } from "@/components/auth/Field";

export default function AccountForm({
  username,
  email,
}: {
  username: string;
  email: string;
}) {
  const [state, formAction] = useFormState<ActionResult | undefined, FormData>(
    updateUsernameAction,
    undefined
  );

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 sm:p-7">
        <form action={formAction} className="flex flex-col gap-4">
          <Field label="Username" name="username" defaultValue={username} />
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-faint">
              Email
            </label>
            <input
              value={email}
              disabled
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-ink-faint"
            />
            <p className="mt-1.5 text-xs text-ink-faint">
              Email changes aren&apos;t supported here yet.
            </p>
          </div>

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

          <div className="w-40">
            <SubmitButton>Save changes</SubmitButton>
          </div>
        </form>
      </div>

      <div className="glass rounded-3xl p-6 sm:p-7">
        <h3 className="font-display text-base font-semibold text-ink">
          Security
        </h3>
        <p className="mt-1 text-sm text-ink-muted">
          Want a new password? We&apos;ll email you a secure reset link.
        </p>
        <Link
          href="/forgot-password"
          className="mt-4 inline-flex rounded-full glass px-5 py-2.5 text-sm text-ink"
        >
          Reset password
        </Link>
      </div>
    </div>
  );
}
