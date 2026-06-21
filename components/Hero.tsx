"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";
import GradientButton from "./ui/GradientButton";
import DashboardMockup from "./DashboardMockup";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 sm:pt-40">
      <div className="container-x grid items-center gap-14 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-24">
        {/* Left: copy */}
        <div className="text-center lg:text-left">
          <motion.span
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="eyebrow mb-6"
          >
            <Star size={13} className="text-brand-violet" />
            AI marketing for small business
          </motion.span>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl"
          >
            AI Tools That Help Your{" "}
            <span className="text-gradient animate-gradient-pan">
              Business Work Smarter
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted lg:mx-0"
          >
            Create posts, ads, emails, product descriptions, and business
            content in seconds — written in your brand&apos;s voice, ready to
            publish.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <GradientButton href="#pricing" size="lg" className="w-full sm:w-auto">
              Start Free
              <ArrowRight size={18} />
            </GradientButton>
            <GradientButton
              href="#demo"
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Play size={16} />
              View Demo
            </GradientButton>
          </motion.div>

          {/* trust row */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-col items-center gap-4 text-sm text-ink-faint sm:flex-row lg:justify-start"
          >
            <div className="flex -space-x-2">
              {["from-indigo-400 to-violet-500", "from-sky-400 to-indigo-500", "from-fuchsia-400 to-rose-500", "from-emerald-400 to-sky-500"].map(
                (g, i) => (
                  <span
                    key={i}
                    className={`h-8 w-8 rounded-full border-2 border-base bg-gradient-to-br ${g}`}
                  />
                )
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="flex text-amber-300">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </span>
              <span>Loved by 2,000+ small businesses</span>
            </div>
          </motion.div>
        </div>

        {/* Right: mockup */}
        <div className="[perspective:1600px]">
          <DashboardMockup />
        </div>
      </div>

      {/* fade into next section */}
      <div className="rule mx-auto max-w-7xl" />
    </section>
  );
}
