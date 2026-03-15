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
      {/* Grid — 40px aligned */}
      {Array.from({ length: 16 }, (_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="400" stroke="hsl(50, 6%, 85%)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 40} x2="600" y2={i * 40} stroke="hsl(50, 6%, 85%)" strokeWidth="0.5" />
      ))}
      {[0, 160, 320, 480].map((x) => (
        <line key={`sv${x}`} x1={x} y1="0" x2={x} y2="400" stroke="hsl(50, 6%, 78%)" strokeWidth="0.75" />
      ))}

      {/* Dimension line */}
      <line x1={a.x} y1={a.y + 44} x2={b.x} y2={b.y + 44} stroke="hsl(0, 0%, 28%)" strokeWidth="1" />
      <line x1={a.x} y1={a.y + 36} x2={a.x} y2={a.y + 52} stroke="hsl(0, 0%, 28%)" strokeWidth="1" />
      <line x1={b.x} y1={b.y + 36} x2={b.x} y2={b.y + 52} stroke="hsl(0, 0%, 28%)" strokeWidth="1" />
      <text x={midX} y={a.y + 64} textAnchor="middle" fill="hsl(0, 0%, 28%)" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="500">
        d = {Math.round(dist)}
      </text>

      {/* Curve glow */}
      <path d={`M${a.x},${a.y} Q${midX},${curveY} ${b.x},${b.y}`} fill="none" stroke="hsl(54, 100%, 45%)" strokeWidth="12" opacity="0.1" />
      {/* Curve main */}
      <path d={`M${a.x},${a.y} Q${midX},${curveY} ${b.x},${b.y}`} fill="none" stroke="hsl(54, 100%, 45%)" strokeWidth="3" />

      {/* C crosshair */}
      <line x1={midX - 14} y1={curveY} x2={midX + 14} y2={curveY} stroke="hsl(54, 100%, 35%)" strokeWidth="1" />
      <line x1={midX} y1={curveY - 14} x2={midX} y2={curveY + 14} stroke="hsl(54, 100%, 35%)" strokeWidth="1" />
      <circle cx={midX} cy={curveY} r="6" fill="hsl(54, 100%, 45%)" />
      <text x={midX + 18} y={curveY - 8} fill="hsl(0, 0%, 13%)" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">C</text>

      {/* Point A */}
      <g onMouseDown={() => setDragging("a")} className="cursor-grab">
        <circle cx={a.x} cy={a.y} r="16" fill="transparent" />
        <line x1={a.x - 12} y1={a.y} x2={a.x + 12} y2={a.y} stroke="hsl(0, 0%, 13%)" strokeWidth="1.25" />
        <line x1={a.x} y1={a.y - 12} x2={a.x} y2={a.y + 12} stroke="hsl(0, 0%, 13%)" strokeWidth="1.25" />
        <circle cx={a.x} cy={a.y} r="8" fill="hsl(0, 0%, 13%)" />
        <text x={a.x} y={a.y - 20} textAnchor="middle" fill="hsl(0, 0%, 13%)" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="700">A</text>
      </g>

      {/* Point B */}
      <g onMouseDown={() => setDragging("b")} className="cursor-grab">
        <circle cx={b.x} cy={b.y} r="16" fill="transparent" />
        <line x1={b.x - 12} y1={b.y} x2={b.x + 12} y2={b.y} stroke="hsl(0, 0%, 13%)" strokeWidth="1.25" />
        <line x1={b.x} y1={b.y - 12} x2={b.x} y2={b.y + 12} stroke="hsl(0, 0%, 13%)" strokeWidth="1.25" />
        <circle cx={b.x} cy={b.y} r="8" fill="hsl(0, 0%, 13%)" />
        <text x={b.x} y={b.y - 20} textAnchor="middle" fill="hsl(0, 0%, 13%)" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="700">B</text>
      </g>

      {/* Readout */}
      <rect x="16" y="16" width="160" height="68" fill="hsl(50, 33%, 97%)" stroke="hsl(50, 6%, 78%)" strokeWidth="1.5" />
      <text x="28" y="34" fill="hsl(0, 0%, 42%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">RELATION STATE</text>
      <text x="28" y="56" fill="hsl(0, 0%, 13%)" fontSize="18" fontFamily="IBM Plex Mono" fontWeight="700">{descriptor}</text>
      <text x="28" y="72" fill="hsl(0, 0%, 42%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">
        A({Math.round(a.x)},{Math.round(a.y)}) B({Math.round(b.x)},{Math.round(b.y)})
      </text>
    </svg>
  );
};

export default TRPViz;
