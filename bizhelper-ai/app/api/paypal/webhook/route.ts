import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyWebhookSignature } from "@/lib/paypal";
import { planIdFromPaypalPlan } from "@/lib/plans";

export const runtime = "nodejs";

/**
 * PayPal subscription webhook.
 *
 * Configure the endpoint URL ({your-domain}/api/paypal/webhook) in the PayPal
 * developer dashboard and copy the generated Webhook ID into PAYPAL_WEBHOOK_ID.
 * Subscribe to the BILLING.SUBSCRIPTION.* events.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const verified = await verifyWebhookSignature(req.headers, rawBody);
  if (!verified) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Server not configured." }, { status: 503 });
  }

  const event = JSON.parse(rawBody);
  const type: string = event.event_type;
  const resource = event.resource ?? {};
  const subscriptionId: string | undefined = resource.id;
  if (!subscriptionId) return NextResponse.json({ ok: true });

  // Find the profile that owns this subscription.
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("paypal_subscription_id", subscriptionId)
    .single();

  // For activation we may not have linked it yet; fall back to custom_id if set.
  const targetId =
    profile?.id ?? (resource.custom_id as string | undefined) ?? null;
  if (!targetId) return NextResponse.json({ ok: true });

  switch (type) {
    case "BILLING.SUBSCRIPTION.ACTIVATED":
    case "BILLING.SUBSCRIPTION.UPDATED": {
      const plan = resource.plan_id
        ? planIdFromPaypalPlan(resource.plan_id)
        : null;
      await admin
        .from("profiles")
        .update({
          ...(plan ? { current_plan: plan } : {}),
          paypal_subscription_id: subscriptionId,
          subscription_status: resource.status ?? "ACTIVE",
          subscription_renews_at:
            resource.billing_info?.next_billing_time ?? null,
        })
        .eq("id", targetId);
      break;
    }
    case "BILLING.SUBSCRIPTION.CANCELLED":
    case "BILLING.SUBSCRIPTION.EXPIRED":
    case "BILLING.SUBSCRIPTION.SUSPENDED": {
      await admin
        .from("profiles")
        .update({
          current_plan: "free",
          subscription_status: resource.status ?? "CANCELLED",
          subscription_renews_at: null,
        })
        .eq("id", targetId);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ ok: true });
}
