"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Wand2 } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";
import { cn } from "@/lib/cn";
import GradientButton from "./ui/GradientButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <Link href="#top" className="flex items-center gap-2.5 pl-1">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-glow-sm">
              <Wand2 className="text-white" size={18} />
            </span>
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
            <Link
              href="#demo"
              className="rounded-full px-4 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              Sign in
            </Link>
            <GradientButton href="#pricing">Start Free</GradientButton>
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
            <div className="p-2">
              <GradientButton
                href="#pricing"
                className="w-full"
              >
                Start Free
              </GradientButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
