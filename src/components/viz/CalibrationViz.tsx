import { useEffect, useRef, useState } from "react";

const CalibrationViz = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mouse, setMouse] = useState({ x: 300, y: 200 });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handleMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - rect.left) / rect.width) * 600,
        y: ((e.clientY - rect.top) / rect.height) * 400,
      });
    };
    svg.addEventListener("mousemove", handleMove);
    return () => svg.removeEventListener("mousemove", handleMove);
  }, []);

  const ax = 140, ay = 210;
  const bx = 460, by = 210;
  const cx = mouse.x * 0.35 + 300 * 0.65;
  const cy = mouse.y * 0.35 + 110 * 0.65;

  return (
    <svg ref={svgRef} viewBox="0 0 600 400" className="h-full w-full cursor-crosshair">
      {/* Background grid */}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="hsl(50, 8%, 88%)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} stroke="hsl(50, 8%, 88%)" strokeWidth="0.5" />
      ))}

      {/* Axis markers */}
      {[100, 200, 300, 400, 500].map((x) => (
        <text key={x} x={x} y="395" textAnchor="middle" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">{x}</text>
      ))}
      {[100, 200, 300].map((y) => (
        <text key={y} x="8" y={y + 3} fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">{y}</text>
      ))}

      {/* Reference crosshairs at A and B */}
      <line x1={ax - 15} y1={ay} x2={ax + 15} y2={ay} stroke="hsl(0, 0%, 17%)" strokeWidth="0.75" />
      <line x1={ax} y1={ay - 15} x2={ax} y2={ay + 15} stroke="hsl(0, 0%, 17%)" strokeWidth="0.75" />
      <line x1={bx - 15} y1={by} x2={bx + 15} y2={by} stroke="hsl(0, 0%, 17%)" strokeWidth="0.75" />
      <line x1={bx} y1={by - 15} x2={bx} y2={by + 15} stroke="hsl(0, 0%, 17%)" strokeWidth="0.75" />

      {/* Relation curve — thick, visible */}
      <path
        d={`M${ax},${ay} Q${cx},${cy} ${bx},${by}`}
        fill="none"
        stroke="hsl(54, 100%, 50%)"
        strokeWidth="2.5"
      />
      {/* Shadow curve for depth */}
      <path
        d={`M${ax},${ay} Q${cx},${cy} ${bx},${by}`}
        fill="none"
        stroke="hsl(54, 100%, 50%)"
        strokeWidth="8"
        opacity="0.08"
      />

      {/* Points */}
      <circle cx={ax} cy={ay} r="6" fill="hsl(0, 0%, 17%)" />
      <circle cx={bx} cy={by} r="6" fill="hsl(0, 0%, 17%)" />
      <circle cx={cx} cy={cy} r="4" fill="hsl(54, 100%, 50%)" />

      {/* Labels */}
      <text x={ax} y={ay + 28} textAnchor="middle" fill="hsl(0, 0%, 17%)" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="500">A</text>
      <text x={bx} y={by + 28} textAnchor="middle" fill="hsl(0, 0%, 17%)" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="500">B</text>
      <text x={cx + 14} y={cy - 8} fill="hsl(0, 0%, 40%)" fontSize="9" fontFamily="IBM Plex Mono">C ({Math.round(cx)}, {Math.round(cy)})</text>

      {/* Distance readout */}
      <rect x="420" y="20" width="160" height="44" fill="hsl(50, 33%, 97%)" stroke="hsl(50, 8%, 82%)" strokeWidth="1" />
      <text x="430" y="36" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">DISTANCE A→B</text>
      <text x="430" y="52" fill="hsl(0, 0%, 17%)" fontSize="13" fontFamily="IBM Plex Mono" fontWeight="500">
        {Math.round(Math.hypot(bx - ax, by - ay))} units
      </text>

      {/* Measurement ticks along baseline */}
      {Array.from({ length: 7 }, (_, i) => {
        const t = i / 6;
        const px = ax + (bx - ax) * t;
        return (
          <g key={i}>
            <line x1={px} y1={ay - 5} x2={px} y2={ay + 5} stroke="hsl(0, 0%, 17%)" strokeWidth="0.75" />
          </g>
        );
      })}
    </svg>
  );
};

export default CalibrationViz;
