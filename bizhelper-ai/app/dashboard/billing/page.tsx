import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/profile";
import { getPlan, PLAN_ORDER, PLAN_CONFIG, paypalPlanIdFor } from "@/lib/plans";
import BillingPanel, {
  type BillingPlan,
} from "@/components/dashboard/BillingPanel";

export const metadata = { title: "Billing" };

export default async function BillingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const currentPlan = getPlan(user.profile?.current_plan).id;
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? null;

  // Plan IDs are public identifiers; safe to pass to the client for the SDK.
  const plans: BillingPlan[] = PLAN_ORDER.map((id) => ({
    id,
    name: PLAN_CONFIG[id].name,
    price: PLAN_CONFIG[id].price,
    limit: PLAN_CONFIG[id].monthlyLimit,
    paypalPlanId: paypalPlanIdFor(id) ?? null,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Billing &amp; plans
        </h1>
        <p className="mt-1.5 text-ink-muted">
          Upgrade, downgrade, or cancel anytime. Billed monthly via PayPal.
        </p>
      </header>

      <BillingPanel
        currentPlan={currentPlan}
        clientId={clientId}
        plans={plans}
        subscriptionStatus={user.profile?.subscription_status ?? null}
      />
    </div>
  );
}
