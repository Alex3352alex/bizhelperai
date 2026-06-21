import { createClient } from "@/lib/supabase/server";
import type { PlanId } from "@/lib/plans";

export type Profile = {
  id: string;
  email: string | null;
  username: string | null;
  created_at: string;
  current_plan: PlanId;
  paypal_subscription_id: string | null;
  subscription_status: string | null;
  subscription_started_at: string | null;
  subscription_renews_at: string | null;
  generations_used: number;
  usage_period_start: string | null;
};

export type CurrentUser = {
  id: string;
  email: string | null;
  profile: Profile | null;
};

/**
 * Returns the signed-in user and their profile row, or null if not signed in
 * (or if Supabase isn't configured).
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    profile: (profile as Profile) ?? null,
  };
}
