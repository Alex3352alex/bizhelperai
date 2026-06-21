import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata = { title: "Checkout cancelled" };

export default function BillingCancelPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-ink-muted">
        <XCircle size={30} />
      </span>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Checkout cancelled
      </h1>
      <p className="mt-2 text-ink-muted">
        No charge was made. You can pick a plan whenever you&apos;re ready.
      </p>
      <Link
        href="/dashboard/billing"
        className="mt-6 inline-flex rounded-full glass px-6 py-2.5 text-sm font-medium text-ink"
      >
        Back to plans
      </Link>
    </div>
  );
}
