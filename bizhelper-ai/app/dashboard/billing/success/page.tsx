import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = { title: "Subscription active" };

export default function BillingSuccessPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300">
        <CheckCircle2 size={30} />
      </span>
      <h1 className="font-display text-2xl font-semibold text-ink">
        You&apos;re all set
      </h1>
      <p className="mt-2 text-ink-muted">
        Your subscription is active. Your new plan limits are live right away.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex rounded-full bg-brand-gradient px-6 py-2.5 text-sm font-medium text-white shadow-glow-sm"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
