import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cancelSubscription } from "@/lib/paypal";

export const runtime = "nodejs";

export async function POST() {
  const supabase = createClient();
  if (!supabase)
    return NextResponse.json({ error: "Not configured." }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("paypal_subscription_id")
    .eq("id", user.id)
    .single();

  const subId = profile?.paypal_subscription_id as string | null;
  if (!subId)
    return NextResponse.json({ error: "No active subscription." }, { status: 400 });

  try {
    await cancelSubscription(subId);
    // Reflect immediately; the webhook will also confirm BILLING.SUBSCRIPTION.CANCELLED.
    await supabase
      .from("profiles")
      .update({
        current_plan: "free",
        subscription_status: "CANCELLED",
        subscription_renews_at: null,
      })
      .eq("id", user.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("cancel error:", err);
    return NextResponse.json({ error: "Could not cancel." }, { status: 500 });
  }
}
