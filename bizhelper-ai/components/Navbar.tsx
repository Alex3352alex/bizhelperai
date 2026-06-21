"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/app/auth/actions";
import GradientButton from "./ui/GradientButton";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auth-aware: reflect the current session and keep it live.
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      const u = data.user;
      setAuthed(Boolean(u));
      setDisplayName(
        (u?.user_metadata?.username as string) || u?.email || null
      );
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      setAuthed(Boolean(u));
      setDisplayName(
        (u?.user_metadata?.username as string) || u?.email || null
      );
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await signOutAction();
    setAuthed(false);
    setDisplayName(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="container-x">
        <nav
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300",
            scrolled ? "glass-strong shadow-card" : "border border-transparent"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 pl-1">
            <Image
              src="/logo.png"
              alt="BizHelper AI"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              priority
            />
            <span className="font-display text-lg font-semibold tracking-tight">
              BizHelper<span className="text-gradient"> AI</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-2 md:flex">
            {authed ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  <LayoutDashboard size={16} />
                  <span className="max-w-[10rem] truncate">{displayName}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="grid h-9 w-9 place-items-center rounded-full glass text-ink-muted transition-colors hover:text-rose-300"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  Sign in
                </Link>
                <GradientButton href="/signup">Start Free</GradientButton>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full glass md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="glass-strong mt-2 rounded-3xl p-2 shadow-card md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm text-ink-muted transition-colors hover:bg-white/5 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-1 border-t border-white/10 p-2">
              {authed ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-ink-muted hover:text-ink"
                  >
                    <LayoutDashboard size={16} /> Dashboard ({displayName})
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm text-ink-muted hover:text-rose-300"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-3 py-2.5 text-sm text-ink-muted hover:text-ink"
                  >
                    Sign in
                  </Link>
                  <GradientButton href="/signup" className="w-full">
                    Start Free
                  </GradientButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
