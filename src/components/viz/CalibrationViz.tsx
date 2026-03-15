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
      {/* Background grid — subtle, matches page grid */}
      {Array.from({ length: 16 }, (_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="400" stroke="hsl(50, 6%, 85%)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 40} x2="600" y2={i * 40} stroke="hsl(50, 6%, 85%)" strokeWidth="0.5" />
      ))}
      {/* Stronger grid every 4 */}
      {[0, 160, 320, 480].map((x) => (
        <line key={`sv${x}`} x1={x} y1="0" x2={x} y2="400" stroke="hsl(50, 6%, 78%)" strokeWidth="0.75" />
      ))}
      {[0, 160, 320].map((y) => (
        <line key={`sh${y}`} x1="0" y1={y} x2="600" y2={y} stroke="hsl(50, 6%, 78%)" strokeWidth="0.75" />
      ))}

      {/* Axis labels */}
      {[160, 320, 480].map((x) => (
        <text key={x} x={x} y="395" textAnchor="middle" fill="hsl(0, 0%, 42%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">{x}</text>
      ))}
      {[160, 320].map((y) => (
        <text key={y} x="12" y={y + 3} fill="hsl(0, 0%, 42%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">{y}</text>
      ))}

      {/* Crosshairs at A and B */}
      <line x1={ax - 16} y1={ay} x2={ax + 16} y2={ay} stroke="hsl(0, 0%, 13%)" strokeWidth="1" />
      <line x1={ax} y1={ay - 16} x2={ax} y2={ay + 16} stroke="hsl(0, 0%, 13%)" strokeWidth="1" />
      <line x1={bx - 16} y1={by} x2={bx + 16} y2={by} stroke="hsl(0, 0%, 13%)" strokeWidth="1" />
      <line x1={bx} y1={by - 16} x2={bx} y2={by + 16} stroke="hsl(0, 0%, 13%)" strokeWidth="1" />

      {/* Relation curve — glow */}
      <path d={`M${ax},${ay} Q${cx},${cy} ${bx},${by}`} fill="none" stroke="hsl(54, 100%, 45%)" strokeWidth="10" opacity="0.12" />
      {/* Relation curve — main */}
      <path d={`M${ax},${ay} Q${cx},${cy} ${bx},${by}`} fill="none" stroke="hsl(54, 100%, 45%)" strokeWidth="3" />

      {/* Points */}
      <circle cx={ax} cy={ay} r="7" fill="hsl(0, 0%, 13%)" />
      <circle cx={bx} cy={by} r="7" fill="hsl(0, 0%, 13%)" />
      <circle cx={cx} cy={cy} r="5" fill="hsl(54, 100%, 45%)" />

      {/* Labels */}
      <text x={ax} y={ay + 30} textAnchor="middle" fill="hsl(0, 0%, 13%)" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="600">A</text>
      <text x={bx} y={by + 30} textAnchor="middle" fill="hsl(0, 0%, 13%)" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="600">B</text>
      <text x={cx + 16} y={cy - 8} fill="hsl(0, 0%, 28%)" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="500">C ({Math.round(cx)}, {Math.round(cy)})</text>

      {/* Measurement ticks along baseline */}
      {Array.from({ length: 7 }, (_, i) => {
        const t = i / 6;
        const px = ax + (bx - ax) * t;
        return <line key={i} x1={px} y1={ay - 6} x2={px} y2={ay + 6} stroke="hsl(0, 0%, 13%)" strokeWidth="1" />;
      })}

      {/* Readout panel */}
      <rect x="420" y="16" width="168" height="52" fill="hsl(50, 33%, 97%)" stroke="hsl(50, 6%, 78%)" strokeWidth="1.5" />
      <text x="432" y="34" fill="hsl(0, 0%, 42%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">DISTANCE A→B</text>
      <text x="432" y="54" fill="hsl(0, 0%, 13%)" fontSize="15" fontFamily="IBM Plex Mono" fontWeight="600">
        {Math.round(Math.hypot(bx - ax, by - ay))} units
      </text>
    </svg>
  );
};

export default CalibrationViz;
