"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Wand2,
  LayoutGrid,
  Megaphone,
  Mail,
  ShoppingBag,
  Calendar,
  Sparkles,
  Check,
} from "lucide-react";

const SAMPLE = `✨ New season, same obsession with great coffee.

Single-origin beans, roasted in small batches every Tuesday — so what lands in your cup is never more than a week from the roaster.

Tag a friend who needs this in their morning. ☕️👇

#specialtycoffee #smallbatch #morningritual`;

export default function DashboardMockup() {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(reduce ? SAMPLE : "");
  const [done, setDone] = useState(reduce);
  const idx = useRef(0);

  useEffect(() => {
    if (reduce) return;
    setTyped("");
    setDone(false);
    idx.current = 0;
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        idx.current += 2;
        if (idx.current >= SAMPLE.length) {
          setTyped(SAMPLE);
          setDone(true);
          clearInterval(iv);
        } else {
          setTyped(SAMPLE.slice(0, idx.current));
        }
      }, 22);
    }, 700);
    return () => clearTimeout(start);
  }, [reduce]);

  const sidebar = useMemo(
    () => [
      { icon: LayoutGrid, active: false },
      { icon: Megaphone, active: true },
      { icon: Mail, active: false },
      { icon: ShoppingBag, active: false },
      { icon: Calendar, active: false },
    ],
    []
  );

  return (
    <div className="relative">
      {/* glow base */}
      <div className="absolute inset-0 -z-10 translate-y-8 scale-95 rounded-[2.5rem] bg-brand-gradient opacity-30 blur-3xl" />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="glass-strong relative overflow-hidden rounded-[2rem] shadow-card"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
          <span className="h-3 w-3 rounded-full bg-rose-400/70" />
          <span className="h-3 w-3 rounded-full bg-amber-400/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
          <div className="mx-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-ink-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            app.bizhelper.ai/generate
          </div>
        </div>

        <div className="flex">
          {/* mini sidebar */}
          <div className="hidden flex-col items-center gap-3 border-r border-white/10 px-3 py-5 sm:flex">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient">
              <Wand2 size={15} className="text-white" />
            </span>
            <div className="mt-2 flex flex-col gap-2">
              {sidebar.map(({ icon: Icon, active }, i) => (
                <span
                  key={i}
                  className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${
                    active
                      ? "bg-white/10 text-ink"
                      : "text-ink-faint hover:text-ink-muted"
                  }`}
                >
                  <Icon size={16} />
                </span>
              ))}
            </div>
          </div>

          {/* main panel */}
          <div className="flex-1 p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                  Generate
                </p>
                <p className="font-display text-sm font-medium text-ink">
                  Social Media Post
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-violet/15 px-2.5 py-1 text-[11px] font-medium text-brand-violet ring-1 ring-brand-violet/30">
                <Sparkles size={12} /> Friendly tone
              </span>
            </div>

            {/* input chips */}
            <div className="mb-4 flex flex-wrap gap-2">
              {["Coffee roastery", "Instagram", "With hashtags"].map((c) => (
                <span
                  key={c}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-ink-muted"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* result card */}
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-[11px] text-ink-faint">
                {done ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <Check size={12} /> Ready to publish
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-brand-sky">
                    <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-brand-sky" />
                    Generating…
                  </span>
                )}
              </div>
              <pre className="whitespace-pre-wrap font-sans text-[12.5px] leading-relaxed text-ink/90">
                {typed}
                {!done && (
                  <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse-dot bg-brand-violet" />
                )}
              </pre>
            </div>

            {/* stat strip */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { k: "Generated", v: "12.4k" },
                { k: "Avg. time", v: "2.1s" },
                { k: "Saved/mo", v: "18 hrs" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
                >
                  <p className="font-display text-sm font-semibold text-ink">
                    {s.v}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-ink-faint">
                    {s.k}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* floating accent chips */}
      <motion.div
        animate={reduce ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="glass-strong absolute -left-4 top-1/3 hidden items-center gap-2 rounded-2xl px-3 py-2 shadow-glow-sm sm:flex"
      >
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-400/15 text-emerald-300">
          <Check size={14} />
        </span>
        <span className="text-xs text-ink-muted">On-brand</span>
      </motion.div>

      <motion.div
        animate={reduce ? {} : { y: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="glass-strong absolute -right-3 bottom-10 hidden items-center gap-2 rounded-2xl px-3 py-2 shadow-glow-sm sm:flex"
      >
        <Sparkles size={14} className="text-brand-violet" />
        <span className="text-xs text-ink-muted">7-day plan ready</span>
      </motion.div>
    </div>
  );
}
