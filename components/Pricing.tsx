import { Check } from "lucide-react";
import { PLANS } from "@/lib/data";
import { cn } from "@/lib/cn";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import GradientButton from "./ui/GradientButton";

export default function Pricing() {
  return (
    <section id="pricing" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Pricing"
          title={
            <>
              Simple plans that{" "}
              <span className="text-gradient">grow with you</span>
            </>
          }
          subtitle="Start free, upgrade when you outgrow it. No contracts, cancel anytime."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.07}>
              <div
                className={cn(
                  "relative h-full",
                  plan.highlighted && "lg:-translate-y-3"
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-brand-gradient px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-glow-sm">
                    Most popular
                  </span>
                )}
                <div
                  className={cn(
                    "relative h-full overflow-hidden rounded-3xl p-[1px]",
                    plan.highlighted
                      ? "bg-brand-gradient shadow-glow"
                      : "bg-white/10"
                  )}
                >
                  <div className="flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-base-soft/80 p-6 backdrop-blur-xl">
                    <div>
                      <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                        {plan.name}
                      </h3>
                      <p className="mt-1 text-xs text-ink-faint">
                        {plan.tagline}
                      </p>
                    </div>

                    <div className="mt-5 flex items-end gap-1">
                      <span className="font-display text-4xl font-semibold text-ink">
                        {plan.price}
                      </span>
                      <span className="pb-1.5 text-sm text-ink-faint">
                        {plan.cadence}
                      </span>
                    </div>

                    <div className="my-6 rule" />

                    <ul className="flex-1 space-y-3">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2.5 text-sm text-ink-muted"
                        >
                          <span
                            className={cn(
                              "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                              plan.highlighted
                                ? "bg-brand-violet/25 text-brand-violet"
                                : "bg-white/10 text-ink"
                            )}
                          >
                            <Check size={12} strokeWidth={3} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7">
                      <GradientButton
                        href="#demo"
                        variant={plan.highlighted ? "primary" : "ghost"}
                        className="w-full"
                      >
                        {plan.cta}
                      </GradientButton>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-sm text-ink-faint">
            All paid plans include a 7-day money-back guarantee. Prices in USD.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
