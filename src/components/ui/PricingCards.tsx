import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Star } from "lucide-react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { Switch } from "./Switch";
import { useIsMobile } from "./useIsMobile";

export interface PricingPlan {
  name: string;
  price?: number;
  yearlyPrice?: number;
  period?: string;
  isCustom?: boolean;
  customPrice?: string;
  features: (string | { text: string; highlight?: boolean })[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingCardsProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function PricingCards({
  plans,
  title = "Pricing, plainly.",
  description = "One subscription, billed however you prefer. Prefer to own it outright? Talk to us about a one-time purchase.",
}: PricingCardsProps) {
  const [isMonthly, setIsMonthly] = useState(false);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const skipMotion = reduce || isMobile;
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ["#1D9E75", "#085041", "#E6F5EF"],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  return (
    <div>
      <div className="text-center space-y-1.5">
        <h2 className="font-display text-xl md:text-2xl font-semibold text-ink">{title}</h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">{description}</p>
      </div>

      <div className="flex justify-center items-center gap-3 mt-4">
        <span className="text-sm font-medium text-slate-600">Monthly</span>
        <Switch ref={switchRef} checked={!isMonthly} onCheckedChange={handleToggle} />
        <span className="text-sm font-medium text-ink">
          Annual <span className="text-teal-dark font-semibold">(Save 40%)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mt-10 md:mt-12 items-center max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={skipMotion ? false : { y: 30, opacity: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={skipMotion ? { duration: 0 } : { duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`relative rounded-2xl border bg-white flex flex-col text-center ${
              plan.isPopular
                ? "p-6 border-2 border-teal shadow-xl shadow-teal-dark/10 md:scale-110 z-10"
                : "p-4 border-slate-200"
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-teal-dark px-3 py-1 text-xs font-semibold text-white">
                <Star className="h-3 w-3 fill-current" />
                Most popular
              </div>
            )}
            <p className={`font-semibold text-slate-500 uppercase tracking-wide ${plan.isPopular ? "text-sm" : "text-xs"}`}>
              {plan.name}
            </p>
            {plan.isCustom ? (
              <div className="mt-2 flex items-baseline justify-center gap-1">
                <span className={`font-display font-semibold text-ink ${plan.isPopular ? "text-3xl" : "text-2xl"}`}>
                  {plan.customPrice ?? "Custom"}
                </span>
              </div>
            ) : (
              <div className="mt-2 flex items-baseline justify-center gap-1">
                <span
                  className={`font-display font-semibold text-ink tabular-nums ${plan.isPopular ? "text-3xl" : "text-2xl"}`}
                >
                  <NumberFlow
                    value={isMonthly ? plan.price ?? 0 : plan.yearlyPrice ?? 0}
                    format={{ style: "currency", currency: "CAD", minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                    willChange
                    transformTiming={{ duration: 500, easing: "ease-out" }}
                  />
                </span>
                <span className="text-xs text-slate-500">/ {plan.period}</span>
              </div>
            )}
            <p className="text-[11px] text-slate-500">
              {plan.isCustom ? "priced to your setup" : isMonthly ? "billed monthly" : "billed annually"}
            </p>

            <ul className="mt-3 flex flex-col gap-1.5 text-left">
              {plan.features.map((feature) => {
                const isObj = typeof feature !== "string";
                const text = isObj ? feature.text : feature;
                const highlight = isObj && feature.highlight;
                return (
                  <li key={text} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <Check className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-teal-dark" />
                    <span
                      className={
                        highlight
                          ? "font-bold bg-gradient-to-r from-teal-dark to-teal bg-clip-text text-transparent"
                          : undefined
                      }
                    >
                      {text}
                    </span>
                  </li>
                );
              })}
            </ul>

            <hr className="my-3 border-slate-200" />

            <a
              href={plan.href}
              className={`inline-flex items-center justify-center rounded px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                plan.isPopular
                  ? "bg-teal-dark text-white hover:bg-teal"
                  : "border border-slate-300 text-ink hover:border-slate-400"
              }`}
            >
              {plan.buttonText}
            </a>
            <p className="mt-2 text-[11px] text-slate-500">{plan.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
