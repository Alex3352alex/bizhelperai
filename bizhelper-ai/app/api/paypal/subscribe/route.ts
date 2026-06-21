import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/paypal";
import { planIdFromPaypalPlan } from "@/lib/plans";

export const runtime = "nodejs";

/**
 * Called by the client after the PayPal Buttons flow returns a subscriptionID.
 * We re-fetch the subscription from PayPal (never trust the client) and, if it
 * belongs to the signed-in user, store it on their profile.
 */
export async function POST(req: NextRequest) {
  const supabase = createClient();
  if (!supabase)
    return NextResponse.json({ error: "Not configured." }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let subscriptionId: string;
  try {
    const body = await req.json();
    subscriptionId = String(body.subscriptionId ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  if (!subscriptionId)
    return NextResponse.json({ error: "Missing subscriptionId." }, { status: 400 });

  try {
    const sub = await getSubscription(subscriptionId);
    const plan = planIdFromPaypalPlan(sub.plan_id);
    if (!plan)
      return NextResponse.json({ error: "Unknown plan." }, { status: 400 });

    const { error } = await supabase
      .from("profiles")
      .update({
        current_plan: plan,
        paypal_subscription_id: sub.id,
        subscription_status: sub.status,
        subscription_started_at: sub.start_time ?? new Date().toISOString(),
        subscription_renews_at: sub.billing_info?.next_billing_time ?? null,
        // reset usage at the start of a new paid period
        generations_used: 0,
        usage_period_start: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) throw error;
    return NextResponse.json({ ok: true, plan, status: sub.status });
  } catch (err) {
    console.error("subscribe error:", err);
    return NextResponse.json(
      { error: "Could not confirm subscription." },
      { status: 500 }
    );
  }
}
