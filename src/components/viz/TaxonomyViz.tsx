import { useState, useEffect, useRef } from "react";

type TaxMode = "survive" | "seed" | "defend";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alive: boolean;
}

const TaxonomyViz = ({ onModeChange }: { onModeChange?: (mode: TaxMode) => void }) => {
  const [mode, setMode] = useState<TaxMode>("survive");
  const [particles, setParticles] = useState<Particle[]>([]);
  const frameRef = useRef<number>(0);

  const handleMode = (m: TaxMode) => {
    setMode(m);
    onModeChange?.(m);
    // Reset particles for new mode
    const initial: Particle[] = Array.from({ length: mode === "seed" ? 8 : 5 }, () => ({
      x: 250 + Math.random() * 100,
      y: 150 + Math.random() * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      alive: true,
    }));
    setParticles(initial);
  };

  useEffect(() => {
    handleMode("survive");
  }, []);

  useEffect(() => {
    const tick = () => {
      setParticles((prev) =>
        prev.map((p) => {
          if (!p.alive) return p;
          let { x, y, vx, vy } = p;
          x += vx;
          y += vy;

          if (mode === "survive") {
            // Drift toward center
            vx += (300 - x) * 0.001;
            vy += (200 - y) * 0.001;
          } else if (mode === "seed") {
            // Expand outward
            vx += (x - 300) * 0.0005;
            vy += (y - 200) * 0.0005;
          } else {
            // Orbit
            const angle = Math.atan2(y - 200, x - 300);
            vx += Math.cos(angle + Math.PI / 2) * 0.05;
            vy += Math.sin(angle + Math.PI / 2) * 0.05;
            // Pull toward center
            vx += (300 - x) * 0.002;
            vy += (200 - y) * 0.002;
          }

          vx *= 0.99;
          vy *= 0.99;

          return { ...p, x, y, vx, vy };
        })
      );
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [mode]);

  const accentColor = mode === "defend" ? "hsl(151, 100%, 45%)" : "hsl(54, 100%, 50%)";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {(["survive", "seed", "defend"] as TaxMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleMode(m)}
            className={`font-mono text-[11px] uppercase tracking-[0.15em] px-3 py-1.5 border transition-colors ${
              mode === m
                ? m === "defend"
                  ? "border-accent-green text-accent-green"
                  : "border-accent text-accent"
                : "border-ink-faint text-foreground/40 hover:text-foreground/60"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 600 400" className="h-full w-full">
        {/* Central reference */}
        <circle cx="300" cy="200" r="2" className="fill-foreground/30" />
        <circle cx="300" cy="200" r="40" fill="none" stroke="hsl(50, 10%, 90%)" strokeWidth="0.5" strokeDasharray="3,3" />
        <circle cx="300" cy="200" r="100" fill="none" stroke="hsl(50, 10%, 90%)" strokeWidth="0.5" strokeDasharray="3,3" />

        {particles.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill={accentColor} opacity="0.8" />
            {mode === "seed" && (
              <circle cx={p.x} cy={p.y} r="10" fill="none" stroke={accentColor} strokeWidth="0.5" opacity="0.3" />
            )}
            {mode === "defend" && (
              <line x1={p.x} y1={p.y} x2="300" y2="200" stroke={accentColor} strokeWidth="0.3" opacity="0.3" />
            )}
          </g>
        ))}

        <text x="300" y="380" textAnchor="middle" className="fill-foreground/25 font-mono text-[9px]">
          {mode === "survive" && "resisting dissolution"}
          {mode === "seed" && "propagating structure"}
          {mode === "defend" && "maintaining boundary"}
        </text>
      </svg>
    </div>
  );
};

export default TaxonomyViz;
