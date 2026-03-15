import { useState, useEffect, useRef } from "react";

type TaxMode = "survive" | "seed" | "defend";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const TaxonomyViz = ({ onModeChange }: { onModeChange?: (mode: TaxMode) => void }) => {
  const [mode, setMode] = useState<TaxMode>("survive");
  const [particles, setParticles] = useState<Particle[]>([]);
  const frameRef = useRef<number>(0);

  const initParticles = () =>
    Array.from({ length: 7 }, () => ({
      x: 280 + Math.random() * 40,
      y: 180 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
    }));

  const handleMode = (m: TaxMode) => {
    setMode(m);
    onModeChange?.(m);
    setParticles(initParticles());
  };

  useEffect(() => {
    setParticles(initParticles());
  }, []);

  useEffect(() => {
    const tick = () => {
      setParticles((prev) =>
        prev.map((p) => {
          let { x, y, vx, vy } = p;
          x += vx;
          y += vy;
          if (mode === "survive") {
            vx += (300 - x) * 0.002;
            vy += (200 - y) * 0.002;
          } else if (mode === "seed") {
            vx += (x - 300) * 0.0008;
            vy += (y - 200) * 0.0008;
          } else {
            const angle = Math.atan2(y - 200, x - 300);
            vx += Math.cos(angle + Math.PI / 2) * 0.06;
            vy += Math.sin(angle + Math.PI / 2) * 0.06;
            vx += (300 - x) * 0.003;
            vy += (200 - y) * 0.003;
          }
          vx *= 0.985;
          vy *= 0.985;
          return { ...p, x, y, vx, vy };
        })
      );
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [mode]);

  const accentStroke = mode === "defend" ? "hsl(151, 100%, 45%)" : "hsl(54, 100%, 50%)";
  const accentFill = mode === "defend" ? "hsl(151, 100%, 45%)" : "hsl(54, 100%, 50%)";
  const modeDescriptions = {
    survive: "RESISTING DISSOLUTION — pattern holds against entropy",
    seed: "PROPAGATING STRUCTURE — generating copies outward",
    defend: "MAINTAINING BOUNDARY — active perimeter response",
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Mode tabs */}
      <div className="flex gap-1">
        {(["survive", "seed", "defend"] as TaxMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleMode(m)}
            className={`px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] border transition-colors ${
              mode === m
                ? m === "defend"
                  ? "border-accent-green text-accent-green bg-accent-green/5"
                  : "border-accent text-foreground bg-accent/10"
                : "border-ink-faint text-foreground/40 hover:text-foreground/60 hover:border-foreground/30"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 600 400" className="h-full w-full">
        {/* Grid */}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="hsl(50, 8%, 88%)" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} stroke="hsl(50, 8%, 88%)" strokeWidth="0.5" />
        ))}

        {/* Reference rings */}
        <circle cx="300" cy="200" r="3" fill="hsl(0, 0%, 17%)" opacity="0.4" />
        <circle cx="300" cy="200" r="50" fill="none" stroke="hsl(0, 0%, 17%)" strokeWidth="0.75" strokeDasharray="4,4" opacity="0.25" />
        <circle cx="300" cy="200" r="110" fill="none" stroke="hsl(0, 0%, 17%)" strokeWidth="0.75" strokeDasharray="4,4" opacity="0.15" />
        <text x="360" y="155" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">r=50</text>
        <text x="420" y="100" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">r=110</text>

        {/* Connection lines in defend mode */}
        {mode === "defend" && particles.map((p, i) => (
          <line key={`conn${i}`} x1={p.x} y1={p.y} x2="300" y2="200" stroke={accentStroke} strokeWidth="0.75" opacity="0.25" />
        ))}

        {/* Trail lines between consecutive particles in seed mode */}
        {mode === "seed" && particles.map((p, i) => {
          if (i === 0) return null;
          const prev = particles[i - 1];
          return <line key={`trail${i}`} x1={prev.x} y1={prev.y} x2={p.x} y2={p.y} stroke={accentStroke} strokeWidth="0.5" opacity="0.2" />;
        })}

        {/* Particles */}
        {particles.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="6" fill={accentFill} opacity="0.9" />
            <circle cx={p.x} cy={p.y} r="12" fill="none" stroke={accentStroke} strokeWidth="0.75" opacity="0.2" />
            {mode === "seed" && (
              <circle cx={p.x} cy={p.y} r="18" fill="none" stroke={accentStroke} strokeWidth="0.5" opacity="0.1" />
            )}
          </g>
        ))}

        {/* Mode label */}
        <rect x="20" y="350" width="400" height="36" fill="hsl(50, 33%, 97%)" stroke="hsl(50, 8%, 82%)" strokeWidth="1" />
        <text x="30" y="372" fill="hsl(0, 0%, 45%)" fontSize="9" fontFamily="IBM Plex Mono">
          {modeDescriptions[mode]}
        </text>
      </svg>
    </div>
  );
};

export default TaxonomyViz;
