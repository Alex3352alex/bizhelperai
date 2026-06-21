import { STEPS } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import GlassCard from "./ui/GlassCard";
import Reveal from "./ui/Reveal";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              From idea to published in{" "}
              <span className="text-gradient">three steps</span>
            </>
          }
          subtitle="No onboarding calls, no learning curve. Set up once, then generate whenever inspiration (or a deadline) strikes."
        />

        <div className="relative mt-16">
          {/* connecting line on desktop */}
          <div className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block" />

          <div className="grid gap-6 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.number} delay={i * 0.12}>
                <div className="relative flex flex-col items-center text-center">
                  {/* number node */}
                  <div className="relative z-10 mb-6 grid h-[4.5rem] w-[4.5rem] place-items-center rounded-2xl glass-strong shadow-glow-sm">
                    <span className="font-display text-2xl font-semibold text-gradient">
                      {step.number}
                    </span>
                  </div>
                  <GlassCard className="w-full p-6">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {step.description}
                    </p>
                  </GlassCard>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
