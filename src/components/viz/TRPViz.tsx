import { useEffect, useRef, useState } from "react";
import { VIZ, SvgGrid, ReadoutPanel } from "./shared";

const TRPViz = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [a, setA] = useState({ x: 132, y: 220 });
  const [b, setB] = useState({ x: 462, y: 220 });
  const [dragging, setDragging] = useState<"a" | "b" | null>(null);

  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const descriptor = dist < 80 ? "compressed" : dist < 200 ? "taut" : dist > 350 ? "slack" : "held";
  const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
  const curveY = midY - Math.max(30, 160 - dist * 0.3);

  useEffect(() => {
    if (!svgRef.current || !dragging) return;
    const svg = svgRef.current;
    const handleMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const pos = { x: Math.max(30, Math.min(570, ((e.clientX - rect.left) / rect.width) * 600)), y: Math.max(30, Math.min(370, ((e.clientY - rect.top) / rect.height) * 400)) };
      dragging === "a" ? setA(pos) : setB(pos);
    };
    const handleUp = () => setDragging(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
  }, [dragging]);

  return (
    <svg ref={svgRef} viewBox="0 0 600 400" className="h-full w-full">
      <SvgGrid />

      {/* Dimension line */}
      <line x1={a.x} y1={a.y + 44} x2={b.x} y2={b.y + 44} stroke={VIZ.inkStrong} strokeWidth="1" />
      <line x1={a.x} y1={a.y + 36} x2={a.x} y2={a.y + 52} stroke={VIZ.inkStrong} strokeWidth="1" />
      <line x1={b.x} y1={b.y + 36} x2={b.x} y2={b.y + 52} stroke={VIZ.inkStrong} strokeWidth="1" />
      <text x={midX} y={a.y + 64} textAnchor="middle" fill={VIZ.inkStrong} fontSize="10" fontFamily={VIZ.mono}>d = {Math.round(dist)}</text>

      {/* Curve */}
      <path d={`M${a.x},${a.y} Q${midX},${curveY} ${b.x},${b.y}`} fill="none" stroke={VIZ.yellow} strokeWidth="12" opacity="0.08" />
      <path d={`M${a.x},${a.y} Q${midX},${curveY} ${b.x},${b.y}`} fill="none" stroke={VIZ.yellow} strokeWidth="3" />

      {/* C */}
      <line x1={midX - 14} y1={curveY} x2={midX + 14} y2={curveY} stroke={VIZ.yellowDim} strokeWidth="1" />
      <line x1={midX} y1={curveY - 14} x2={midX} y2={curveY + 14} stroke={VIZ.yellowDim} strokeWidth="1" />
      <circle cx={midX} cy={curveY} r="6" fill={VIZ.yellow} />
      <text x={midX + 18} y={curveY - 8} fill={VIZ.ink} fontSize="12" fontFamily={VIZ.mono} fontWeight="700">C</text>

      {/* Points */}
      {([["a", a, setDragging] as const, ["b", b, setDragging] as const]).map(([label, pos]) => (
        <g key={label} onMouseDown={() => setDragging(label as "a" | "b")} className="cursor-grab">
          <circle cx={pos.x} cy={pos.y} r="16" fill="transparent" />
          <line x1={pos.x - 12} y1={pos.y} x2={pos.x + 12} y2={pos.y} stroke={VIZ.ink} strokeWidth="1.25" />
          <line x1={pos.x} y1={pos.y - 12} x2={pos.x} y2={pos.y + 12} stroke={VIZ.ink} strokeWidth="1.25" />
          <circle cx={pos.x} cy={pos.y} r="8" fill={VIZ.ink} />
          <text x={pos.x} y={pos.y - 20} textAnchor="middle" fill={VIZ.ink} fontSize="12" fontFamily={VIZ.mono} fontWeight="700">{label.toUpperCase()}</text>
        </g>
      ))}

      <ReadoutPanel x={12} y={12} w={168} h={68}>
        <text x="24" y="30" fill={VIZ.inkMedium} fontSize="9" fontFamily={VIZ.mono}>RELATION STATE</text>
        <text x="24" y="54" fill={VIZ.ink} fontSize="20" fontFamily={VIZ.display} fontWeight="900">{descriptor}</text>
        <text x="24" y="70" fill={VIZ.inkMedium} fontSize="9" fontFamily={VIZ.mono}>
          A({Math.round(a.x)},{Math.round(a.y)}) B({Math.round(b.x)},{Math.round(b.y)})
        </text>
      </ReadoutPanel>
    </svg>
  );
};

export default TRPViz;
