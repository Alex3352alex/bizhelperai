import type { SupabaseClient } from "@supabase/supabase-js";
import { getPlan, type PlanId } from "@/lib/plans";

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export type UsageSnapshot = {
  plan: PlanId;
  used: number;
  limit: number; // Infinity for unlimited
  remaining: number; // Infinity for unlimited
  periodStart: string;
};

type ProfileUsageRow = {
  current_plan: PlanId | null;
  generations_used: number | null;
  usage_period_start: string | null;
};

/**
 * Returns the user's current usage, rolling the monthly window over if the last
 * period started more than 30 days ago. Writes the reset back when it happens.
 */
export async function getUsageSnapshot(
  supabase: SupabaseClient,
  userId: string
): Promise<UsageSnapshot> {
  const { data } = await supabase
    .from("profiles")
    .select("current_plan, generations_used, usage_period_start")
    .eq("id", userId)
    .single();

  const row = (data as ProfileUsageRow) ?? {
    current_plan: "free",
    generations_used: 0,
    usage_period_start: null,
  };

  const plan = getPlan(row.current_plan);
  const now = Date.now();
  const startMs = row.usage_period_start
    ? new Date(row.usage_period_start).getTime()
    : 0;

  let used = row.generations_used ?? 0;
  let periodStart = row.usage_period_start ?? new Date(now).toISOString();

  if (!row.usage_period_start || now - startMs > MONTH_MS) {
    used = 0;
    periodStart = new Date(now).toISOString();
    await supabase
      .from("profiles")
      .update({ generations_used: 0, usage_period_start: periodStart })
      .eq("id", userId);
  }

  const limit = plan.monthlyLimit;
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - used);

  return { plan: plan.id, used, limit, remaining, periodStart };
}

export async function incrementUsage(
  supabase: SupabaseClient,
  userId: string,
  current: number
): Promise<void> {
  await supabase
    .from("profiles")
    .update({ generations_used: current + 1 })
    .eq("id", userId);
}
