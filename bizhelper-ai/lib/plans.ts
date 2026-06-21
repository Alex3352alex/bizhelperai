/**
 * Single source of truth for plans, monthly generation limits, and the
 * environment variable that holds each plan's PayPal Plan ID.
 */

export type PlanId = "free" | "basic" | "pro" | "business";

export type PlanConfig = {
  id: PlanId;
  name: string;
  price: number; // USD / month
  /** Monthly generation cap. Infinity = unlimited. */
  monthlyLimit: number;
  /** Name of the env var holding this plan's PayPal Plan ID (server-side). */
  paypalPlanEnv?: string;
};

export const PLAN_CONFIG: Record<PlanId, PlanConfig> = {
  free: { id: "free", name: "Free", price: 0, monthlyLimit: 3 },
  basic: {
    id: "basic",
    name: "Basic",
    price: 9,
    monthlyLimit: 150,
    paypalPlanEnv: "PAYPAL_BASIC_PLAN_ID",
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 19,
    monthlyLimit: Infinity,
    paypalPlanEnv: "PAYPAL_PRO_PLAN_ID",
  },
  business: {
    id: "business",
    name: "Business",
    price: 49,
    monthlyLimit: Infinity,
    paypalPlanEnv: "PAYPAL_BUSINESS_PLAN_ID",
  },
};

export const PLAN_ORDER: PlanId[] = ["free", "basic", "pro", "business"];

export function getPlan(id: string | null | undefined): PlanConfig {
  if (id && id in PLAN_CONFIG) return PLAN_CONFIG[id as PlanId];
  return PLAN_CONFIG.free;
}

export function limitLabel(limit: number): string {
  return limit === Infinity ? "Unlimited" : String(limit);
}

/** Resolve the PayPal Plan ID for a plan from server env (server-only). */
export function paypalPlanIdFor(id: PlanId): string | undefined {
  const env = PLAN_CONFIG[id].paypalPlanEnv;
  return env ? process.env[env] : undefined;
}

/** Reverse lookup: given a PayPal Plan ID, find which plan it belongs to. */
export function planIdFromPaypalPlan(paypalPlanId: string): PlanId | null {
  for (const id of PLAN_ORDER) {
    const env = PLAN_CONFIG[id].paypalPlanEnv;
    if (env && process.env[env] && process.env[env] === paypalPlanId) {
      return id;
    }
  }
  return null;
}
