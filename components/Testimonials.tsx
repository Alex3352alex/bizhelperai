import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import GlassCard from "./ui/GlassCard";
import Reveal from "./ui/Reveal";

const AVATAR_GRADIENTS = [
  "from-indigo-400 to-violet-500",
  "from-sky-400 to-indigo-500",
  "from-fuchsia-400 to-rose-500",
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Loved by owners"
          title={
            <>
              Real businesses,{" "}
              <span className="text-gradient">real time back</span>
            </>
          }
          subtitle="Thousands of small teams use BizHelper to stay consistent without hiring an agency."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <GlassCard hover className="flex h-full flex-col p-7">
                <Quote
                  size={28}
                  className="mb-4 text-brand-violet/60"
                  strokeWidth={1.5}
                />
                <p className="flex-1 text-[15px] leading-relaxed text-ink/90">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="mt-5 flex text-amber-300">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={15} fill="currentColor" />
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[i]} font-display text-sm font-semibold text-white`}
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-ink-faint">{t.role}</p>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
