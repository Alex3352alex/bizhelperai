import { ArrowRight } from "lucide-react";
import Reveal from "./ui/Reveal";
import GradientButton from "./ui/GradientButton";

export default function CTA() {
  return (
    <section className="relative py-12 sm:py-20">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl border border-white/10 p-10 text-center shadow-card sm:p-16">
            {/* gradient wash */}
            <div className="absolute inset-0 -z-10 bg-brand-soft" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_120%_at_50%_-20%,rgba(124,92,255,0.35),transparent_70%)]" />

            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Stop staring at the blank page.{" "}
              <span className="text-gradient">Start publishing.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-ink-muted sm:text-lg">
              Join 2,000+ small businesses creating a week of content in
              minutes. Your first three generations are on us.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <GradientButton href="#pricing" size="lg">
                Start Free
                <ArrowRight size={18} />
              </GradientButton>
              <GradientButton href="#demo" variant="ghost" size="lg">
                View Demo
              </GradientButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
