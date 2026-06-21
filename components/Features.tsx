import { FEATURES } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import GlassCard from "./ui/GlassCard";
import Reveal from "./ui/Reveal";

export default function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Everything you need"
          title={
            <>
              One tool for every piece of{" "}
              <span className="text-gradient">content you publish</span>
            </>
          }
          subtitle="Six purpose-built generators that turn a quick prompt into polished, on-brand marketing — no copywriter required."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={i * 0.06}>
                <GlassCard hover className="h-full p-6">
                  <div
                    className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${feature.accent} ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon size={22} className="text-ink" />
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {feature.description}
                  </p>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
