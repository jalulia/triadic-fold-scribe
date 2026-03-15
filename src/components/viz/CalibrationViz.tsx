import { useEffect, useRef, useState } from "react";
import { VIZ, SvgGrid, ReadoutPanel } from "./shared";

const CalibrationViz = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mouse, setMouse] = useState({ x: 300, y: 200 });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handleMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      setMouse({ x: ((e.clientX - rect.left) / rect.width) * 600, y: ((e.clientY - rect.top) / rect.height) * 400 });
    };
    svg.addEventListener("mousemove", handleMove);
    return () => svg.removeEventListener("mousemove", handleMove);
  }, []);

  const ax = 132, ay = 220, bx = 462, by = 220;
  const cx = mouse.x * 0.35 + 300 * 0.65;
  const cy = mouse.y * 0.35 + 110 * 0.65;

  return (
    <svg ref={svgRef} viewBox="0 0 600 400" className="h-full w-full cursor-crosshair">
      <SvgGrid />

      {/* Crosshairs */}
      {[[ax, ay], [bx, by]].map(([px, py], i) => (
        <g key={i}>
          <line x1={px - 16} y1={py} x2={px + 16} y2={py} stroke={VIZ.ink} strokeWidth="1" />
          <line x1={px} y1={py - 16} x2={px} y2={py + 16} stroke={VIZ.ink} strokeWidth="1" />
        </g>
      ))}

      {/* Curve glow + main */}
      <path d={`M${ax},${ay} Q${cx},${cy} ${bx},${by}`} fill="none" stroke={VIZ.yellow} strokeWidth="10" opacity="0.1" />
      <path d={`M${ax},${ay} Q${cx},${cy} ${bx},${by}`} fill="none" stroke={VIZ.yellow} strokeWidth="3" />

      {/* Points */}
      <circle cx={ax} cy={ay} r="7" fill={VIZ.ink} />
      <circle cx={bx} cy={by} r="7" fill={VIZ.ink} />
      <circle cx={cx} cy={cy} r="5" fill={VIZ.yellow} />

      {/* Labels */}
      <text x={ax} y={ay + 30} textAnchor="middle" fill={VIZ.ink} fontSize="12" fontFamily={VIZ.mono} fontWeight="700">A</text>
      <text x={bx} y={by + 30} textAnchor="middle" fill={VIZ.ink} fontSize="12" fontFamily={VIZ.mono} fontWeight="700">B</text>
      <text x={cx + 16} y={cy - 8} fill={VIZ.inkStrong} fontSize="10" fontFamily={VIZ.mono}>C ({Math.round(cx)}, {Math.round(cy)})</text>

      {/* Measurement ticks */}
      {Array.from({ length: 7 }, (_, i) => {
        const t = i / 6;
        const px = ax + (bx - ax) * t;
        return <line key={i} x1={px} y1={ay - 6} x2={px} y2={ay + 6} stroke={VIZ.ink} strokeWidth="1" />;
      })}

      <ReadoutPanel x={416} y={12} w={172} h={52}>
        <text x="428" y="30" fill={VIZ.inkMedium} fontSize="9" fontFamily={VIZ.mono}>DISTANCE A→B</text>
        <text x="428" y="50" fill={VIZ.ink} fontSize="16" fontFamily={VIZ.mono} fontWeight="700">
          {Math.round(Math.hypot(bx - ax, by - ay))} units
        </text>
      </ReadoutPanel>
    </svg>
  );
};

export default CalibrationViz;
