import { useState, useCallback } from "react";

interface Disturbance {
  id: number;
  x: number;
  y: number;
  stable: boolean;
}

let distId = 0;

const StabilityViz = () => {
  const [disturbances, setDisturbances] = useState<Disturbance[]>([]);
  const [stats, setStats] = useState({ stable: 0, transient: 0 });

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 600;
    const y = ((e.clientY - rect.top) / rect.height) * 400;

    const nearby = disturbances.filter((d) => Math.hypot(d.x - x, d.y - y) < 90);
    const isStable = nearby.length >= 1;
    const newD: Disturbance = { id: distId++, x, y, stable: isStable };

    setDisturbances((prev) => [...prev.slice(-25), newD]);
    setStats((prev) => ({
      stable: prev.stable + (isStable ? 1 : 0),
      transient: prev.transient + (isStable ? 0 : 1),
    }));
  }, [disturbances]);

  return (
    <svg viewBox="0 0 600 400" className="h-full w-full cursor-crosshair" onClick={handleClick}>
      {/* Grid */}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="hsl(50, 8%, 88%)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} stroke="hsl(50, 8%, 88%)" strokeWidth="0.5" />
      ))}

      {disturbances.map((d) => (
        <g key={d.id}>
          {/* Outer ring for stable */}
          {d.stable && (
            <>
              <circle cx={d.x} cy={d.y} r={24} fill="none" stroke="hsl(54, 100%, 50%)" strokeWidth="1" opacity="0.25" />
              <circle cx={d.x} cy={d.y} r={36} fill="none" stroke="hsl(54, 100%, 50%)" strokeWidth="0.5" opacity="0.12" strokeDasharray="3,3" />
            </>
          )}
          {/* Main circle */}
          <circle
            cx={d.x}
            cy={d.y}
            r={d.stable ? 14 : 8}
            fill={d.stable ? "hsla(54, 100%, 50%, 0.08)" : "none"}
            stroke={d.stable ? "hsl(54, 100%, 50%)" : "hsl(0, 0%, 17%)"}
            strokeWidth={d.stable ? 2 : 1.25}
          />
          {/* Center dot */}
          <circle
            cx={d.x}
            cy={d.y}
            r={d.stable ? 3.5 : 2.5}
            fill={d.stable ? "hsl(54, 100%, 50%)" : "hsl(0, 0%, 17%)"}
            opacity={d.stable ? 1 : 0.5}
          />
          {/* Crosshair for stable */}
          {d.stable && (
            <>
              <line x1={d.x - 8} y1={d.y} x2={d.x + 8} y2={d.y} stroke="hsl(54, 100%, 50%)" strokeWidth="0.75" opacity="0.5" />
              <line x1={d.x} y1={d.y - 8} x2={d.x} y2={d.y + 8} stroke="hsl(54, 100%, 50%)" strokeWidth="0.75" opacity="0.5" />
            </>
          )}
        </g>
      ))}

      {/* Status panel */}
      <rect x="20" y="20" width="180" height="50" fill="hsl(50, 33%, 97%)" stroke="hsl(50, 8%, 82%)" strokeWidth="1" />
      <text x="30" y="38" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">PERSISTENCE ANALYSIS</text>
      <text x="30" y="55" fill="hsl(54, 100%, 40%)" fontSize="13" fontFamily="IBM Plex Mono" fontWeight="600">●  {stats.stable} stable</text>
      <text x="130" y="55" fill="hsl(0, 0%, 55%)" fontSize="13" fontFamily="IBM Plex Mono">○  {stats.transient} transient</text>
      <text x="30" y="65" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">click near existing to reinforce</text>
    </svg>
  );
};

export default StabilityViz;
