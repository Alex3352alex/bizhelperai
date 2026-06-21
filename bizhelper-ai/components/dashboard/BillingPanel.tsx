"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { PLAN_ORDER, PLAN_CONFIG, limitLabel, type PlanId } from "@/lib/plans";
import PayPalButton from "./PayPalButton";

export type BillingPlan = {
  id: PlanId;
  name: string;
  price: number;
  limit: number;
  paypalPlanId: string | null;
};

export default function BillingPanel({
  currentPlan,
  clientId,
  plans,
  subscriptionStatus,
}: {
  currentPlan: PlanId;
  clientId: string | null;
  plans: BillingPlan[];
  subscriptionStatus: string | null;
}) {
  const router = useRouter();
  const [working, setWorking] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleApproved(subscriptionId: string) {
    setWorking("confirm");
    setError(null);
    try {
      const res = await fetch("/api/paypal/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });
      if (!res.ok) throw new Error();
      setNotice("Subscription active — your new plan is live!");
      router.refresh();
    } catch {
      setError("We couldn't confirm the subscription. Contact support if charged.");
    } finally {
      setWorking(null);
    }
  }

  async function handleCancel() {
    if (!confirm("Cancel your subscription? You'll move to the Free plan."))
      return;
    setWorking("cancel");
    setError(null);
    try {
      const res = await fetch("/api/paypal/cancel", { method: "POST" });
      if (!res.ok) throw new Error();
      setNotice("Subscription cancelled. You're back on the Free plan.");
      router.refresh();
    } catch {
      setError("Could not cancel right now. Please try again.");
    } finally {
      setWorking(null);
    }
  }

  const isPaid = currentPlan !== "free";

  return (
    <div className="space-y-6">
      {notice && (
        <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {notice}
        </p>
      )}
      {error && (
        <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      {!clientId && (
        <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          PayPal isn&apos;t configured yet. Add <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code>{" "}
          and your plan IDs to enable checkout. The README has the full setup.
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const config = PLAN_CONFIG[plan.id];
          return (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col rounded-3xl border p-6",
                isCurrent
                  ? "border-brand-violet/50 bg-brand-violet/[0.06] shadow-glow-sm"
                  : "border-white/10 bg-white/[0.03]"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {plan.name}
                </h3>
                {isCurrent && (
                  <span className="rounded-full bg-brand-violet/20 px-2 py-0.5 text-[11px] font-medium text-brand-violet">
                    Current
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-end gap-1">
                <span className="font-display text-3xl font-semibold text-ink">
                  ${plan.price}
                </span>
                <span className="pb-1 text-sm text-ink-faint">
                  {plan.price === 0 ? "" : "/mo"}
                </span>
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
                <Check size={14} className="text-brand-violet" />
                {limitLabel(config.monthlyLimit)} generations / mo
              </p>

              <div className="mt-6">
                {isCurrent ? (
                  isPaid ? (
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={working === "cancel"}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ink-muted transition-colors hover:text-rose-300 disabled:opacity-60"
                    >
                      {working === "cancel" && (
                        <Loader2 size={15} className="animate-spin" />
                      )}
                      Cancel plan
                    </button>
                  ) : (
                    <p className="text-center text-xs text-ink-faint">
                      Your current plan
                    </p>
                  )
                ) : plan.price === 0 ? (
                  <p className="text-center text-xs text-ink-faint">
                    Downgrade by cancelling a paid plan
                  </p>
                ) : clientId && plan.paypalPlanId ? (
                  <PayPalButton
                    clientId={clientId}
                    planId={plan.paypalPlanId}
                    onApproved={handleApproved}
                  />
                ) : (
                  <p className="text-center text-xs text-ink-faint">
                    Add a PayPal Plan ID to enable
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {subscriptionStatus && isPaid && (
        <p className="text-sm text-ink-faint">
          Subscription status:{" "}
          <span className="text-ink">{subscriptionStatus}</span>
        </p>
      )}
      {working === "confirm" && (
        <p className="flex items-center gap-2 text-sm text-ink-muted">
          <Loader2 size={15} className="animate-spin" /> Confirming your
          subscription…
        </p>
      )}
      <p className="text-xs text-ink-faint">
        Secure monthly billing through PayPal. Cancel anytime — access continues
        until the end of the period. Plans shown reflect{" "}
        {PLAN_ORDER.length} tiers.
      </p>
    </div>
  );
}
