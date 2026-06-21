import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getPlan } from "@/lib/plans";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="glass-strong max-w-md rounded-3xl p-8 text-center shadow-card">
          <h1 className="font-display text-xl font-semibold text-ink">
            Dashboard needs Supabase
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Add your Supabase keys to <code>.env.local</code> (and in Vercel) to
            enable accounts and the dashboard. See the README for the exact steps.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-medium text-white"
          >
            Back to site
          </Link>
        </div>
      </main>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const username = user.profile?.username || user.email || "there";
  const planName = getPlan(user.profile?.current_plan).name;

  return (
    <DashboardShell
      username={username}
      email={user.email ?? ""}
      planName={planName}
    >
      {children}
    </DashboardShell>
  );
}
