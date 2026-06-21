"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

/* Minimal shape of the PayPal Buttons SDK we use. */
type PayPalButtonsActions = {
  subscription: { create: (opts: { plan_id: string }) => Promise<string> };
};
type PayPalNamespace = {
  Buttons: (opts: {
    style?: Record<string, unknown>;
    createSubscription: (
      data: unknown,
      actions: PayPalButtonsActions
    ) => Promise<string>;
    onApprove: (data: { subscriptionID?: string | null }) => void;
    onError?: (err: unknown) => void;
  }) => { render: (el: HTMLElement) => Promise<void> };
};

let sdkPromise: Promise<void> | null = null;

function loadSdk(clientId: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as unknown as { paypal?: PayPalNamespace }).paypal)
    return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&vault=true&intent=subscription`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
    document.body.appendChild(script);
  });
  return sdkPromise;
}

export default function PayPalButton({
  clientId,
  planId,
  onApproved,
}: {
  clientId: string;
  planId: string;
  onApproved: (subscriptionId: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadSdk(clientId)
      .then(() => {
        if (cancelled || !ref.current) return;
        const paypal = (window as unknown as { paypal?: PayPalNamespace })
          .paypal;
        if (!paypal) return;
        ref.current.innerHTML = "";
        paypal
          .Buttons({
            style: { shape: "pill", color: "blue", label: "subscribe", height: 44 },
            createSubscription: (_data, actions) =>
              actions.subscription.create({ plan_id: planId }),
            onApprove: (data) => {
              if (data.subscriptionID) onApproved(data.subscriptionID);
            },
            onError: () => setError("PayPal had a problem. Please try again."),
          })
          .render(ref.current)
          .then(() => !cancelled && setLoading(false))
          .catch(() => !cancelled && setError("Could not render PayPal."));
      })
      .catch(() => !cancelled && setError("Could not load PayPal."));

    return () => {
      cancelled = true;
    };
  }, [clientId, planId, onApproved]);

  return (
    <div>
      {loading && !error && (
        <div className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-2.5 text-sm text-ink-muted">
          <Loader2 size={15} className="animate-spin" /> Loading PayPal…
        </div>
      )}
      {error && <p className="text-sm text-rose-300">{error}</p>}
      <div ref={ref} />
    </div>
  );
}
