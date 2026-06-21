import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Sparkles, CalendarClock, Gauge } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/profile";
import { getUsageSnapshot } from "@/lib/usage";
import { getPlan, limitLabel } from "@/lib/plans";

export const metadata = { title: "Dashboard" };

import DashboardGenerator from "@/components/dashboard/DashboardGenerator";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = createClient();
  const user = await getCurrentUser();
  if (!supabase || !user) redirect("/login");

  const snap = await getUsageSnapshot(supabase, user.id);
  const plan = getPlan(user.profile?.current_plan);
  const limit = snap.limit === Infinity ? null : snap.limit;
  const username = user.profile?.username || user.email || "there";

  const stats = [
    {
      icon: Sparkles,
      label: "Current plan",
      value: plan.name,
      sub: plan.price === 0 ? "Free forever" : `$${plan.price}/mo`,
    },
    {
      icon: Gauge,
      label: "Used this period",
      value: `${snap.used}`,
      sub: `of ${limitLabel(snap.limit)}`,
    },
    {
      icon: CalendarClock,
      label: "Renews",
      value: formatDate(user.profile?.subscription_renews_at ?? null),
      sub: user.profile?.subscription_status ?? "—",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-ink-faint">Welcome back,</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            {username} 👋
          </h1>
        </div>
        {plan.id === "free" && (
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-medium text-white shadow-glow-sm"
          >
            Upgrade plan <ArrowUpRight size={16} />
          </Link>
        )}
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass rounded-2xl p-5">
              <Icon size={18} className="mb-3 text-brand-violet" />
              <p className="text-xs uppercase tracking-wider text-ink-faint">
                {s.label}
              </p>
              <p className="font-display text-xl font-semibold text-ink">
                {s.value}
              </p>
              <p className="text-xs text-ink-faint">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Generator */}
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Create content
        </h2>
        <DashboardGenerator initialUsed={snap.used} limit={limit} />
      </section>
    </div>
  );
}
