"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, MapPin, Send, Loader2, Check } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import GlassCard from "./ui/GlassCard";
import Reveal from "./ui/Reveal";

const INFO = [
  {
    icon: Mail,
    label: "Email us",
    value: "hello@bizhelper.ai",
    hint: "We reply within a few hours.",
  },
  {
    icon: MessageSquare,
    label: "Live chat",
    value: "Mon–Fri, 9–6",
    hint: "Real humans, no bots.",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "Remote-first",
    hint: "Serving businesses worldwide.",
  },
];

type Status = "idle" | "sending" | "sent";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    // ── Demo behaviour: simulate sending. ──────────────────────────────
    // To make this real, POST `form` to your endpoint or email service
    // (e.g. /api/contact, Resend, Formspree) and handle the response here.
    await new Promise((r) => setTimeout(r, 1200));

    setStatus("sent");
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setStatus("idle"), 4000);
  }

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <section id="contact" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Let&apos;s get you{" "}
              <span className="text-gradient">publishing</span>
            </>
          }
          subtitle="Questions about plans, features, or whether BizHelper fits your business? Send a note — we'd love to help."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Info column */}
          <div className="flex flex-col gap-4">
            {INFO.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.label} delay={i * 0.08}>
                  <GlassCard hover className="flex items-start gap-4 p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-soft ring-1 ring-white/10">
                      <Icon size={18} className="text-brand-violet" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink-faint">
                        {item.label}
                      </p>
                      <p className="font-display text-base font-medium text-ink">
                        {item.value}
                      </p>
                      <p className="mt-0.5 text-sm text-ink-muted">
                        {item.hint}
                      </p>
                    </div>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>

          {/* Form column */}
          <Reveal delay={0.1}>
            <div className="glass-strong rounded-3xl p-6 shadow-glass sm:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs font-medium uppercase tracking-wider text-ink-faint"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      required
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-brand-violet/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-medium uppercase tracking-wider text-ink-faint"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={update("email")}
                      placeholder="jane@business.com"
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-brand-violet/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-xs font-medium uppercase tracking-wider text-ink-faint"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Tell us a bit about your business and what you're looking for…"
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-brand-violet/50 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="relative inline-flex items-center justify-center gap-2 rounded-full bg-brand-gradient bg-[length:200%_200%] px-7 py-3.5 font-medium text-white shadow-glow transition-all duration-300 hover:bg-[position:100%_50%] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        Send message
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {status === "sent" && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="inline-flex items-center gap-1.5 text-sm text-emerald-300"
                      >
                        <Check size={16} /> Thanks — we&apos;ll be in touch.
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
