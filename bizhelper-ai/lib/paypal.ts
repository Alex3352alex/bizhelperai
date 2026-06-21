/**
 * PayPal REST helpers (server-only).
 *
 * Secrets (PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID) are read from the
 * environment and never sent to the browser. Only NEXT_PUBLIC_PAYPAL_CLIENT_ID
 * is exposed client-side (for the Buttons SDK).
 *
 * Set PAYPAL_ENV=live in production; defaults to sandbox for safe testing.
 */

const PAYPAL_ENV = process.env.PAYPAL_ENV ?? "sandbox";
export const PAYPAL_BASE =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export function isPaypalConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET
  );
}

export async function getAccessToken(): Promise<string> {
  const id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("PayPal is not configured.");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`PayPal token error: ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

export type PaypalSubscription = {
  id: string;
  status: string; // ACTIVE, APPROVAL_PENDING, CANCELLED, SUSPENDED, EXPIRED
  plan_id: string;
  start_time?: string;
  billing_info?: { next_billing_time?: string };
};

export async function getSubscription(
  subscriptionId: string
): Promise<PaypalSubscription> {
  const token = await getAccessToken();
  const res = await fetch(
    `${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`PayPal subscription lookup failed: ${res.status}`);
  return (await res.json()) as PaypalSubscription;
}

export async function cancelSubscription(
  subscriptionId: string,
  reason = "Customer requested cancellation"
): Promise<void> {
  const token = await getAccessToken();
  const res = await fetch(
    `${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    }
  );
  // 204 = success. PayPal returns 422 if already cancelled — treat as success.
  if (!res.ok && res.status !== 422) {
    throw new Error(`PayPal cancel failed: ${res.status}`);
  }
}

/**
 * Verifies a webhook came from PayPal. Returns true only on "SUCCESS".
 * Requires PAYPAL_WEBHOOK_ID (from the PayPal developer dashboard).
 */
export async function verifyWebhookSignature(
  headers: Headers,
  rawBody: string
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;

  const token = await getAccessToken();
  const res = await fetch(
    `${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),
        webhook_id: webhookId,
        webhook_event: JSON.parse(rawBody),
      }),
    }
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data.verification_status === "SUCCESS";
}
