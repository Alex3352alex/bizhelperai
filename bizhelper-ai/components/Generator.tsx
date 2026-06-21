"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Wand2, Copy, Check, Loader2, RefreshCw, Sparkles } from "lucide-react";
import {
  CONTENT_TYPES,
  TONES,
  type ContentTypeId,
  type ToneId,
  type GenerateResponse,
} from "@/lib/generateContent";
import { cn } from "@/lib/cn";

type GeneratorProps = {
  /** Bubbles updated usage to a parent (used by the dashboard meter). */
  onUsage?: (usage: { used: number; limit: number | null }) => void;
  /** Bubbles each successful result to a parent (used for "recent" list). */
  onResult?: (result: GenerateResponse) => void;
  /** Where the "Upgrade" link in the limit message should point. */
  upgradeHref?: string;
};

export default function Generator({
  onUsage,
  onResult,
  upgradeHref,
}: GeneratorProps = {}) {
  const [business, setBusiness] = useState("");
  const [tone, setTone] = useState<ToneId>("friendly");
  const [contentType, setContentType] = useState<ContentTypeId>("social");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setLimitReached(false);
    setCopied(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business, tone, contentType }),
      });
      const data = await res.json();

      if (res.status === 429) {
        setLimitReached(true);
        setError(
          data?.message ??
            "You've reached your generation limit. Upgrade to keep creating."
        );
        return;
      }
      if (!res.ok) throw new Error("Request failed");

      setResult(data as GenerateResponse);
      if (data?.usage && onUsage) onUsage(data.usage);
      if (onResult) onResult(data as GenerateResponse);
    } catch {
      setError("Something went wrong while generating. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      {/* ── Controls ── */}
      <div className="glass-strong rounded-3xl p-6 shadow-glass sm:p-7">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-glow-sm">
            <Sparkles size={16} className="text-white" />
          </span>
          <p className="font-display text-base font-semibold text-ink">
            Content generator
          </p>
        </div>

        {/* Business input */}
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-ink-faint">
          Your business
        </label>
        <input
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          placeholder="e.g. artisan coffee roastery"
          className="mb-6 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-brand-violet/50 focus:outline-none"
        />

        {/* Tone selector */}
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-ink-faint">
          Tone
        </label>
        <div className="mb-6 flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTone(t.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-all",
                tone === t.id
                  ? "border-transparent bg-brand-gradient text-white shadow-glow-sm"
                  : "border-white/10 bg-white/[0.03] text-ink-muted hover:border-white/20 hover:text-ink"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content type selector */}
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-ink-faint">
          Content type
        </label>
        <div className="mb-7 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CONTENT_TYPES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setContentType(c.id)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-xs font-medium transition-all",
                contentType === c.id
                  ? "border-brand-violet/40 bg-brand-violet/15 text-ink"
                  : "border-white/10 bg-white/[0.03] text-ink-muted hover:border-white/20 hover:text-ink"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient bg-[length:200%_200%] px-6 py-3.5 font-medium text-white shadow-glow transition-all duration-300 hover:bg-[position:100%_50%] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Wand2 size={18} />
              Generate content
            </>
          )}
        </button>
      </div>

      {/* ── Result ── */}
      <div className="glass-strong relative flex min-h-[22rem] flex-col rounded-3xl p-6 shadow-glass sm:p-7">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col"
            >
              <div className="mb-5 flex items-center gap-2 text-sm text-brand-sky">
                <span className="h-2 w-2 animate-pulse-dot rounded-full bg-brand-sky" />
                Writing your {contentTypeLabel(contentType)}…
              </div>
              <div className="space-y-3">
                {[100, 92, 96, 70, 88, 60].map((w, i) => (
                  <div
                    key={i}
                    className="relative h-3.5 overflow-hidden rounded-full bg-white/[0.06]"
                    style={{ width: `${w}%` }}
                  >
                    <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  </div>
                ))}
              </div>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 flex-col"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-400/25">
                  <Check size={12} /> {result.meta}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-ink-muted transition-colors hover:text-ink"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/5 text-ink-muted transition-colors hover:text-ink"
                    aria-label="Regenerate"
                  >
                    <RefreshCw size={13} />
                  </button>
                </div>
              </div>
              <pre className="flex-1 whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink/90">
                {result.body}
              </pre>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col items-center justify-center text-center"
            >
              <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <Wand2 size={24} className="text-brand-violet" />
              </span>
              <p className="font-display text-base font-medium text-ink">
                Your content appears here
              </p>
              <p className="mt-1.5 max-w-xs text-sm text-ink-muted">
                Fill in your business, pick a tone and a type, then hit
                generate. Try it — it&apos;s free.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div
            className={cn(
              "mt-4 rounded-xl border px-4 py-3 text-sm",
              limitReached
                ? "border-brand-violet/30 bg-brand-violet/10 text-ink"
                : "border-rose-400/30 bg-rose-400/10 text-rose-200"
            )}
          >
            <p>{error}</p>
            {limitReached && upgradeHref && (
              <Link
                href={upgradeHref}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-1.5 text-xs font-medium text-white"
              >
                Upgrade plan
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function contentTypeLabel(id: ContentTypeId) {
  return CONTENT_TYPES.find((c) => c.id === id)?.label.toLowerCase() ?? "content";
}
