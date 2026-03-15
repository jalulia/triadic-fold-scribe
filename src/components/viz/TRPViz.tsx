import { useEffect, useRef, useState } from "react";

const TRPViz = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [a, setA] = useState({ x: 140, y: 220 });
  const [b, setB] = useState({ x: 460, y: 220 });
  const [dragging, setDragging] = useState<"a" | "b" | null>(null);

  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const descriptor = dist < 80 ? "compressed" : dist < 200 ? "taut" : dist > 350 ? "slack" : "held";

  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  const curveY = midY - Math.max(30, 160 - dist * 0.3);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !dragging) return;
    const handleMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const pos = {
        x: Math.max(30, Math.min(570, ((e.clientX - rect.left) / rect.width) * 600)),
        y: Math.max(30, Math.min(370, ((e.clientY - rect.top) / rect.height) * 400)),
      };
      if (dragging === "a") setA(pos);
      else setB(pos);
    };
    const handleUp = () => setDragging(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging]);

  return (
    <svg ref={svgRef} viewBox="0 0 600 400" className="h-full w-full">
      {/* Grid */}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="hsl(50, 8%, 88%)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} stroke="hsl(50, 8%, 88%)" strokeWidth="0.5" />
      ))}

      {/* Distance dimension line */}
      <line x1={a.x} y1={a.y + 40} x2={b.x} y2={b.y + 40} stroke="hsl(0, 0%, 55%)" strokeWidth="0.75" />
      <line x1={a.x} y1={a.y + 33} x2={a.x} y2={a.y + 47} stroke="hsl(0, 0%, 55%)" strokeWidth="0.75" />
      <line x1={b.x} y1={b.y + 33} x2={b.x} y2={b.y + 47} stroke="hsl(0, 0%, 55%)" strokeWidth="0.75" />
      <text x={midX} y={a.y + 56} textAnchor="middle" fill="hsl(0, 0%, 45%)" fontSize="9" fontFamily="IBM Plex Mono">
        d = {Math.round(dist)}
      </text>

      {/* Relation curve — glow */}
      <path
        d={`M${a.x},${a.y} Q${midX},${curveY} ${b.x},${b.y}`}
        fill="none"
        stroke="hsl(54, 100%, 50%)"
        strokeWidth="10"
        opacity="0.08"
      />
      {/* Relation curve — main */}
      <path
        d={`M${a.x},${a.y} Q${midX},${curveY} ${b.x},${b.y}`}
        fill="none"
        stroke="hsl(54, 100%, 50%)"
        strokeWidth="2.5"
      />

      {/* C point with crosshair */}
      <line x1={midX - 12} y1={curveY} x2={midX + 12} y2={curveY} stroke="hsl(54, 100%, 40%)" strokeWidth="0.75" />
      <line x1={midX} y1={curveY - 12} x2={midX} y2={curveY + 12} stroke="hsl(54, 100%, 40%)" strokeWidth="0.75" />
      <circle cx={midX} cy={curveY} r="5" fill="hsl(54, 100%, 50%)" />
      <text x={midX + 16} y={curveY - 6} fill="hsl(0, 0%, 35%)" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="500">
        C
      </text>

      {/* Point A — draggable */}
      <g onMouseDown={() => setDragging("a")} className="cursor-grab">
        <circle cx={a.x} cy={a.y} r="14" fill="transparent" />
        <line x1={a.x - 10} y1={a.y} x2={a.x + 10} y2={a.y} stroke="hsl(0, 0%, 17%)" strokeWidth="1" />
        <line x1={a.x} y1={a.y - 10} x2={a.x} y2={a.y + 10} stroke="hsl(0, 0%, 17%)" strokeWidth="1" />
        <circle cx={a.x} cy={a.y} r="7" fill="hsl(0, 0%, 17%)" />
        <text x={a.x} y={a.y - 18} textAnchor="middle" fill="hsl(0, 0%, 17%)" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">A</text>
      </g>

      {/* Point B — draggable */}
      <g onMouseDown={() => setDragging("b")} className="cursor-grab">
        <circle cx={b.x} cy={b.y} r="14" fill="transparent" />
        <line x1={b.x - 10} y1={b.y} x2={b.x + 10} y2={b.y} stroke="hsl(0, 0%, 17%)" strokeWidth="1" />
        <line x1={b.x} y1={b.y - 10} x2={b.x} y2={b.y + 10} stroke="hsl(0, 0%, 17%)" strokeWidth="1" />
        <circle cx={b.x} cy={b.y} r="7" fill="hsl(0, 0%, 17%)" />
        <text x={b.x} y={b.y - 18} textAnchor="middle" fill="hsl(0, 0%, 17%)" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">B</text>
      </g>

      {/* Readout panel */}
      <rect x="20" y="20" width="140" height="60" fill="hsl(50, 33%, 97%)" stroke="hsl(50, 8%, 82%)" strokeWidth="1" />
      <text x="30" y="38" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">RELATION STATE</text>
      <text x="30" y="56" fill="hsl(0, 0%, 17%)" fontSize="16" fontFamily="IBM Plex Mono" fontWeight="600">{descriptor}</text>
      <text x="30" y="70" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">
        A({Math.round(a.x)},{Math.round(a.y)}) B({Math.round(b.x)},{Math.round(b.y)})
      </text>
    </svg>
  );
};

export default TRPViz;
