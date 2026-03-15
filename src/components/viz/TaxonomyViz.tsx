import { useState, useEffect, useRef } from "react";

type TaxMode = "survive" | "seed" | "defend";
interface Particle { x: number; y: number; vx: number; vy: number; }

const TaxonomyViz = ({ onModeChange }: { onModeChange?: (mode: TaxMode) => void }) => {
  const [mode, setMode] = useState<TaxMode>("survive");
  const [particles, setParticles] = useState<Particle[]>([]);
  const frameRef = useRef<number>(0);

  const initParticles = () => Array.from({ length: 7 }, () => ({
    x: 280 + Math.random() * 40, y: 180 + Math.random() * 40,
    vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5,
  }));

  const handleMode = (m: TaxMode) => { setMode(m); onModeChange?.(m); setParticles(initParticles()); };
  useEffect(() => { setParticles(initParticles()); }, []);

  useEffect(() => {
    const tick = () => {
      setParticles((prev) => prev.map((p) => {
        let { x, y, vx, vy } = p;
        x += vx; y += vy;
        if (mode === "survive") { vx += (300 - x) * 0.002; vy += (200 - y) * 0.002; }
        else if (mode === "seed") { vx += (x - 300) * 0.0008; vy += (y - 200) * 0.0008; }
        else { const a = Math.atan2(y - 200, x - 300); vx += Math.cos(a + Math.PI / 2) * 0.06; vy += Math.sin(a + Math.PI / 2) * 0.06; vx += (300 - x) * 0.003; vy += (200 - y) * 0.003; }
        vx *= 0.985; vy *= 0.985;
        return { ...p, x, y, vx, vy };
      }));
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [mode]);

  const color = mode === "defend" ? "hsl(151, 100%, 38%)" : "hsl(54, 100%, 45%)";
  const descs: Record<TaxMode, string> = {
    survive: "RESISTING DISSOLUTION — pattern holds against entropy",
    seed: "PROPAGATING STRUCTURE — generating copies outward",
    defend: "MAINTAINING BOUNDARY — active perimeter response",
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1">
        {(["survive", "seed", "defend"] as TaxMode[]).map((m) => (
          <button key={m} onClick={() => handleMode(m)}
            className={`px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] border-2 transition-colors font-medium ${
              mode === m
                ? m === "defend" ? "border-accent-green text-accent-green bg-accent-green/5" : "border-accent text-foreground bg-accent/10"
                : "border-ink-faint text-ink-medium hover:text-foreground hover:border-ink-medium"
            }`}>{m}</button>
        ))}
      </div>
      <svg viewBox="0 0 600 400" className="h-full w-full">
        {Array.from({ length: 16 }, (_, i) => <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="400" stroke="hsl(50, 6%, 85%)" strokeWidth="0.5" />)}
        {Array.from({ length: 11 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 40} x2="600" y2={i * 40} stroke="hsl(50, 6%, 85%)" strokeWidth="0.5" />)}
        <circle cx="300" cy="200" r="3" fill="hsl(0, 0%, 28%)" />
        <circle cx="300" cy="200" r="50" fill="none" stroke="hsl(0, 0%, 28%)" strokeWidth="1" strokeDasharray="4,4" opacity="0.35" />
        <circle cx="300" cy="200" r="110" fill="none" stroke="hsl(0, 0%, 28%)" strokeWidth="1" strokeDasharray="4,4" opacity="0.2" />
        <text x="360" y="155" fill="hsl(0, 0%, 42%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">r=50</text>
        <text x="420" y="100" fill="hsl(0, 0%, 42%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">r=110</text>

        {mode === "defend" && particles.map((p, i) => <line key={`c${i}`} x1={p.x} y1={p.y} x2="300" y2="200" stroke={color} strokeWidth="1" opacity="0.3" />)}
        {mode === "seed" && particles.map((p, i) => { if (!i) return null; const prev = particles[i-1]; return <line key={`t${i}`} x1={prev.x} y1={prev.y} x2={p.x} y2={p.y} stroke={color} strokeWidth="0.75" opacity="0.25" />; })}

        {particles.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="7" fill={color} opacity="0.9" />
            <circle cx={p.x} cy={p.y} r="14" fill="none" stroke={color} strokeWidth="1" opacity="0.25" />
          </g>
        ))}

        <rect x="16" y="346" width="440" height="42" fill="hsl(50, 33%, 97%)" stroke="hsl(50, 6%, 78%)" strokeWidth="1.5" />
        <text x="28" y="372" fill="hsl(0, 0%, 28%)" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="500">{descs[mode]}</text>
      </svg>
    </div>
  );
};

export default TaxonomyViz;
