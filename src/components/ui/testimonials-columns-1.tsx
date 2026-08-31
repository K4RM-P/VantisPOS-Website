import React from "react";
import { motion, useReducedMotion } from "motion/react";

export type Testimonial = {
  text: string;
  name: string;
  role: string;
  initials: string;
  hue: string;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  const reduce = useReducedMotion();

  return (
    <div className={props.className}>
      <motion.div
        animate={reduce ? undefined : { translateY: "-50%" }}
        transition={{
          duration: props.duration || 16,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2).fill(0)].map((_, dupIndex) => (
          <React.Fragment key={dupIndex}>
            {props.testimonials.map(({ text, name, role, initials, hue }, i) => (
              <div
                className="p-8 rounded border border-slate-200 bg-white shadow-sm max-w-xs w-full transition duration-300 hover:-translate-y-1 hover:rotate-1 hover:border-teal/40 hover:shadow-lg"
                key={`${dupIndex}-${i}`}
              >
                <p className="text-sm text-ink leading-relaxed">{text}</p>
                <div className="flex items-center gap-3 mt-5">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                    style={{ backgroundColor: hue }}
                    aria-hidden="true"
                  >
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-display font-medium tracking-tight leading-5 text-ink">
                      {name}
                    </div>
                    <div className="leading-5 text-slate-500 text-sm tracking-tight">
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
