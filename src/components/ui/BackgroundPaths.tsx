function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 14 * position} -${189 + i * 18}C-${380 - i * 14 * position} -${
      189 + i * 18
    } -${312 - i * 14 * position} ${216 - i * 18} ${152 - i * 14 * position} ${
      343 - i * 18
    }C${616 - i * 14 * position} ${470 - i * 18} ${684 - i * 14 * position} ${
      875 - i * 18
    } ${684 - i * 14 * position} ${875 - i * 18}`,
    width: 0.5 + i * 0.08,
    delay: i * 0.9,
  }));

  return (
    <svg className="w-full h-full text-teal-dark" viewBox="0 0 696 316" fill="none" aria-hidden="true">
      {paths.map((path) => (
        <path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          className="bg-path"
          style={{ animationDelay: `${path.delay}s`, ["--o" as string]: 0.08 + path.id * 0.02 }}
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
