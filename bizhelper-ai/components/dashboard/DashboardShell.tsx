"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { signOutAction } from "@/app/auth/actions";

const NAV = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Account", href: "/dashboard/account", icon: Settings },
];

export default function DashboardShell({
  username,
  email,
  planName,
  children,
}: {
  username: string;
  email: string;
  planName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await signOutAction();
    router.push("/login");
    router.refresh();
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ label, href, icon: Icon }) => {
        const active =
          href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors",
              active
                ? "bg-white/10 text-ink"
                : "text-ink-muted hover:bg-white/5 hover:text-ink"
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-white/10 bg-base-soft/40 p-5 backdrop-blur-xl lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="BizHelper AI"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="font-display text-base font-semibold tracking-tight">
            BizHelper<span className="text-gradient"> AI</span>
          </span>
        </Link>

        {nav}

        <div className="mt-auto space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <p className="truncate text-sm font-medium text-ink">{username}</p>
            <p className="truncate text-xs text-ink-faint">{email}</p>
            <span className="mt-2 inline-flex rounded-full bg-brand-violet/15 px-2 py-0.5 text-[11px] font-medium text-brand-violet ring-1 ring-brand-violet/30">
              {planName} plan
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} /> Back to site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-sm text-ink-muted transition-colors hover:text-rose-300"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-white/10 p-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="BizHelper AI"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="font-display text-sm font-semibold">BizHelper AI</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="grid h-10 w-10 place-items-center rounded-full glass"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="glass-strong mx-4 mt-2 rounded-2xl p-3 lg:hidden">
          {nav}
          <div className="mt-2 border-t border-white/10 pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-sm text-ink-muted hover:text-rose-300"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="min-w-0 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
