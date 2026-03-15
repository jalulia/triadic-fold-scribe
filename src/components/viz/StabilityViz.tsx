import { useState, useCallback } from "react";
import { VIZ, SvgGrid, ReadoutPanel } from "./shared";

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
      <SvgGrid />
      {disturbances.map((d) => (
        <g key={d.id}>
          {d.stable && (
            <>
              <circle cx={d.x} cy={d.y} r={26} fill="none" stroke={VIZ.yellow} strokeWidth="1.25" opacity="0.3" />
              <circle cx={d.x} cy={d.y} r={38} fill="none" stroke={VIZ.yellow} strokeWidth="0.75" opacity="0.15" strokeDasharray="4,4" />
            </>
          )}
          <circle cx={d.x} cy={d.y} r={d.stable ? 15 : 9} fill={d.stable ? "hsla(54,100%,50%,0.08)" : "none"} stroke={d.stable ? VIZ.yellow : VIZ.inkStrong} strokeWidth={d.stable ? 2.5 : 1.5} />
          <circle cx={d.x} cy={d.y} r={d.stable ? 4 : 3} fill={d.stable ? VIZ.yellow : VIZ.inkStrong} />
          {d.stable && (
            <>
              <line x1={d.x - 9} y1={d.y} x2={d.x + 9} y2={d.y} stroke={VIZ.yellow} strokeWidth="1" opacity="0.5" />
              <line x1={d.x} y1={d.y - 9} x2={d.x} y2={d.y + 9} stroke={VIZ.yellow} strokeWidth="1" opacity="0.5" />
            </>
          )}
        </g>
      ))}
      <ReadoutPanel x={12} y={12} w={224} h={58}>
        <text x="24" y="30" fill={VIZ.inkMedium} fontSize="9" fontFamily={VIZ.mono}>PERSISTENCE ANALYSIS</text>
        <text x="24" y="50" fill={VIZ.yellowDim} fontSize="14" fontFamily={VIZ.mono} fontWeight="700">● {stats.stable} stable</text>
        <text x="136" y="50" fill={VIZ.inkStrong} fontSize="14" fontFamily={VIZ.mono}>○ {stats.transient} transient</text>
        <text x="24" y="64" fill={VIZ.inkMedium} fontSize="9" fontFamily={VIZ.mono}>click near existing to reinforce</text>
      </ReadoutPanel>
    </svg>
  );
};

export default StabilityViz;
