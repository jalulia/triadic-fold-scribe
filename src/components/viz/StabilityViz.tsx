import { useState, useCallback } from "react";

interface Disturbance { id: number; x: number; y: number; stable: boolean; }
let distId = 0;

const StabilityViz = () => {
  const [disturbances, setDisturbances] = useState<Disturbance[]>([]);
  const [stats, setStats] = useState({ stable: 0, transient: 0 });

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 600;
    const y = ((e.clientY - rect.top) / rect.height) * 400;
    const nearby = disturbances.filter((d) => Math.hypot(d.x - x, d.y - y) < 90);
    const isStable = nearby.length >= 1;
    setDisturbances((prev) => [...prev.slice(-25), { id: distId++, x, y, stable: isStable }]);
    setStats((prev) => ({ stable: prev.stable + (isStable ? 1 : 0), transient: prev.transient + (isStable ? 0 : 1) }));
  }, [disturbances]);

  return (
    <svg viewBox="0 0 600 400" className="h-full w-full cursor-crosshair" onClick={handleClick}>
      {/* Grid */}
      {Array.from({ length: 16 }, (_, i) => <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="400" stroke="hsl(50, 6%, 85%)" strokeWidth="0.5" />)}
      {Array.from({ length: 11 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 40} x2="600" y2={i * 40} stroke="hsl(50, 6%, 85%)" strokeWidth="0.5" />)}

      {disturbances.map((d) => (
        <g key={d.id}>
          {d.stable && (
            <>
              <circle cx={d.x} cy={d.y} r={26} fill="none" stroke="hsl(54, 100%, 45%)" strokeWidth="1.25" opacity="0.3" />
              <circle cx={d.x} cy={d.y} r={38} fill="none" stroke="hsl(54, 100%, 45%)" strokeWidth="0.75" opacity="0.15" strokeDasharray="4,4" />
            </>
          )}
          <circle cx={d.x} cy={d.y} r={d.stable ? 15 : 9} fill={d.stable ? "hsla(54, 100%, 45%, 0.1)" : "none"} stroke={d.stable ? "hsl(54, 100%, 45%)" : "hsl(0, 0%, 28%)"} strokeWidth={d.stable ? 2.5 : 1.5} />
          <circle cx={d.x} cy={d.y} r={d.stable ? 4 : 3} fill={d.stable ? "hsl(54, 100%, 45%)" : "hsl(0, 0%, 28%)"} />
          {d.stable && (
            <>
              <line x1={d.x - 9} y1={d.y} x2={d.x + 9} y2={d.y} stroke="hsl(54, 100%, 45%)" strokeWidth="1" opacity="0.5" />
              <line x1={d.x} y1={d.y - 9} x2={d.x} y2={d.y + 9} stroke="hsl(54, 100%, 45%)" strokeWidth="1" opacity="0.5" />
            </>
          )}
        </g>
      ))}

      <rect x="16" y="16" width="220" height="56" fill="hsl(50, 33%, 97%)" stroke="hsl(50, 6%, 78%)" strokeWidth="1.5" />
      <text x="28" y="34" fill="hsl(0, 0%, 42%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">PERSISTENCE ANALYSIS</text>
      <text x="28" y="54" fill="hsl(54, 100%, 35%)" fontSize="14" fontFamily="IBM Plex Mono" fontWeight="700">● {stats.stable} stable</text>
      <text x="140" y="54" fill="hsl(0, 0%, 28%)" fontSize="14" fontFamily="IBM Plex Mono" fontWeight="500">○ {stats.transient} transient</text>
      <text x="28" y="66" fill="hsl(0, 0%, 42%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">click near existing to reinforce</text>
    </svg>
  );
};

export default StabilityViz;
