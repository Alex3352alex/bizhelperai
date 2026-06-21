"use client";

import { cn } from "@/lib/cn";

export default function UsageMeter({
  used,
  limit,
}: {
  used: number;
  limit: number | null; // null = unlimited
}) {
  const unlimited = limit === null;
  const pct = unlimited ? 0 : Math.min(100, (used / Math.max(1, limit)) * 100);
  const nearLimit = !unlimited && pct >= 80;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
          Generations this period
        </p>
        <p className="font-display text-sm text-ink">
          {used}
          <span className="text-ink-faint"> / {unlimited ? "∞" : limit}</span>
        </p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            unlimited
              ? "w-full bg-brand-gradient"
              : nearLimit
                ? "bg-gradient-to-r from-amber-400 to-rose-400"
                : "bg-brand-gradient"
          )}
          style={{ width: unlimited ? "100%" : `${pct}%` }}
        />
      </div>
      {unlimited && (
        <p className="mt-1.5 text-xs text-emerald-300">Unlimited on your plan</p>
      )}
    </div>
  );
}
