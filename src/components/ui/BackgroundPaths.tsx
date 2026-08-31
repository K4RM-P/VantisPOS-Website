import { motion, useReducedMotion } from "motion/react";

function FloatingPaths({ position }: { position: number }) {
  const reduce = useReducedMotion();
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${
      189 + i * 6
    } -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${
      343 - i * 6
    }C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${
      875 - i * 6
    } ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <svg className="w-full h-full text-teal-dark" viewBox="0 0 696 316" fill="none" aria-hidden="true">
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          strokeOpacity={0.06 + path.id * 0.015}
          initial={{ pathLength: 0.3, opacity: 0.4 }}
          animate={
            reduce
              ? undefined
              : { pathLength: 1, opacity: [0.2, 0.4, 0.2], pathOffset: [0, 1, 0] }
          }
          transition={{ duration: 22 + path.id * 0.6, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </svg>
  );
}

export function BackgroundPaths() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}
