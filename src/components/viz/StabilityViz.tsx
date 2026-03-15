import { useState, useCallback } from "react";

interface Disturbance {
  id: number;
  x: number;
  y: number;
  stable: boolean;
  age: number;
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

    // Check reinforcement from nearby disturbances
    const nearby = disturbances.filter(
      (d) => Math.hypot(d.x - x, d.y - y) < 80
    );
    const isStable = nearby.length >= 1;

    const newD: Disturbance = { id: distId++, x, y, stable: isStable, age: 0 };

    setDisturbances((prev) => [...prev.slice(-20), newD]);
    setStats((prev) => ({
      stable: prev.stable + (isStable ? 1 : 0),
      transient: prev.transient + (isStable ? 0 : 1),
    }));
  }, [disturbances]);

  return (
    <svg viewBox="0 0 600 400" className="h-full w-full cursor-crosshair" onClick={handleClick}>
      {/* Base grid */}
      {Array.from({ length: 10 }, (_, i) => (
        <line key={i} x1={60 * i + 30} y1="20" x2={60 * i + 30} y2="380" stroke="hsl(50, 10%, 93%)" strokeWidth="0.5" />
      ))}

      {disturbances.map((d) => (
        <g key={d.id}>
          <circle
            cx={d.x}
            cy={d.y}
            r={d.stable ? 12 : 6}
            fill="none"
            stroke={d.stable ? "hsl(54, 100%, 50%)" : "hsl(50, 10%, 85%)"}
            strokeWidth={d.stable ? 1.75 : 1}
          />
          {d.stable && (
            <circle
              cx={d.x}
              cy={d.y}
              r={18}
              fill="none"
              stroke="hsl(54, 100%, 50%)"
              strokeWidth="0.5"
              opacity="0.3"
            />
          )}
          <circle
            cx={d.x}
            cy={d.y}
            r="2"
            fill={d.stable ? "hsl(54, 100%, 50%)" : "hsl(0, 0%, 17%)"}
            opacity={d.stable ? 1 : 0.4}
          />
        </g>
      ))}

      <text x="300" y="390" textAnchor="middle" className="fill-foreground/25 font-mono text-[9px]">
        stable: {stats.stable} · transient: {stats.transient} — click to disturb
      </text>
    </svg>
  );
};

export default StabilityViz;
