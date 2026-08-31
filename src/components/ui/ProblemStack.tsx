import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useIsMobile } from "./useIsMobile";

export type PainPoint = { title: string; body: string };

function StackCard({
  point,
  index,
  total,
}: {
  point: PainPoint;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const skipMotion = reduce || isMobile;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const isLast = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.5]);

  return (
    <div
      className={`${skipMotion ? "" : "sticky top-24"} border-l-2 border-teal bg-slate-50 pl-5 py-4 pr-4`}
      style={skipMotion ? undefined : { zIndex: index + 1 }}
      ref={ref}
    >
      <motion.div
        style={skipMotion ? undefined : { scale, opacity }}
        className="origin-top"
      >
        <h3 className="font-display font-semibold text-ink">{point.title}</h3>
        <p className="mt-1 text-sm text-slate-600">{point.body}</p>
      </motion.div>
    </div>
  );
}

export default function ProblemStack({ points }: { points: PainPoint[] }) {
  return (
    <div className="relative">
      {points.map((point, i) => (
        <div key={point.title} className={i === points.length - 1 ? "" : "pb-16"}>
          <StackCard point={point} index={i} total={points.length} />
        </div>
      ))}
    </div>
  );
}
