import { useEffect, useRef, useState } from "react";

const TRPViz = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [a, setA] = useState({ x: 150, y: 200 });
  const [b, setB] = useState({ x: 450, y: 200 });
  const [dragging, setDragging] = useState<"a" | "b" | null>(null);

  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const descriptor = dist < 80 ? "compressed" : dist < 200 ? "taut" : dist > 350 ? "slack" : "held";

  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  const curveY = midY - Math.max(20, 150 - dist * 0.3);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !dragging) return;
    const handleMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const pos = {
        x: Math.max(20, Math.min(580, ((e.clientX - rect.left) / rect.width) * 600)),
        y: Math.max(20, Math.min(380, ((e.clientY - rect.top) / rect.height) * 400)),
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
      {[100, 200, 300, 400, 500].map((x) => (
        <line key={`v${x}`} x1={x} y1="20" x2={x} y2="380" stroke="hsl(50, 10%, 90%)" strokeWidth="0.5" />
      ))}

      {/* Relation curve */}
      <path
        d={`M${a.x},${a.y} Q${midX},${curveY} ${b.x},${b.y}`}
        fill="none"
        stroke="hsl(54, 100%, 50%)"
        strokeWidth="1.75"
      />

      {/* C point */}
      <circle cx={midX} cy={curveY} r="3" className="fill-accent" opacity="0.7" />
      <text x={midX} y={curveY - 12} textAnchor="middle" className="fill-foreground/50 font-mono text-[9px]">
        C
      </text>

      {/* Point A */}
      <g onMouseDown={() => setDragging("a")} className="cursor-grab">
        <circle cx={a.x} cy={a.y} r="8" fill="transparent" />
        <circle cx={a.x} cy={a.y} r="5" className="fill-foreground" />
        <text x={a.x} y={a.y + 20} textAnchor="middle" className="fill-foreground/50 font-mono text-[9px]">A</text>
      </g>

      {/* Point B */}
      <g onMouseDown={() => setDragging("b")} className="cursor-grab">
        <circle cx={b.x} cy={b.y} r="8" fill="transparent" />
        <circle cx={b.x} cy={b.y} r="5" className="fill-foreground" />
        <text x={b.x} y={b.y + 20} textAnchor="middle" className="fill-foreground/50 font-mono text-[9px]">B</text>
      </g>

      {/* Descriptor */}
      <text x="300" y="380" textAnchor="middle" className="fill-foreground/30 font-mono text-[10px]">
        {descriptor}
      </text>
    </svg>
  );
};

export default TRPViz;
