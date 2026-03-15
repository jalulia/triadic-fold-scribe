import { useEffect, useRef, useState } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
  r: number;
  opacity: number;
}

let rippleId = 0;

const FoldBackViz = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mouse, setMouse] = useState({ x: 300, y: 200 });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [memory, setMemory] = useState({ x: 300, y: 200 });
  const frameRef = useRef<number>(0);

  // Central fold position lerps toward memory
  const foldX = 300 + (memory.x - 300) * 0.15;
  const foldY = 200 + (memory.y - 200) * 0.15;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let lastEmit = 0;
    const handleMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 600;
      const my = ((e.clientY - rect.top) / rect.height) * 400;
      setMouse({ x: mx, y: my });

      // Update memory with decay
      setMemory((prev) => ({
        x: prev.x * 0.95 + mx * 0.05,
        y: prev.y * 0.95 + my * 0.05,
      }));

      // Emit ripple occasionally
      const now = Date.now();
      if (now - lastEmit > 200) {
        lastEmit = now;
        setRipples((prev) => [
          ...prev.slice(-8),
          { id: rippleId++, x: foldX, y: foldY, r: 5, opacity: 0.6 },
        ]);
      }
    };
    svg.addEventListener("mousemove", handleMove);
    return () => svg.removeEventListener("mousemove", handleMove);
  }, [foldX, foldY]);

  // Animate ripples
  useEffect(() => {
    const tick = () => {
      setRipples((prev) =>
        prev
          .map((r) => ({ ...r, r: r.r + 1.5, opacity: r.opacity * 0.96 }))
          .filter((r) => r.opacity > 0.05)
      );
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  // Fold geometry distortion based on mouse proximity
  const dist = Math.hypot(mouse.x - 300, mouse.y - 200);
  const pressure = Math.max(0, 1 - dist / 200);
  const foldScale = 1 + pressure * 0.3;

  return (
    <svg ref={svgRef} viewBox="0 0 600 400" className="h-full w-full cursor-crosshair">
      {/* Ripples */}
      {ripples.map((r) => (
        <circle
          key={r.id}
          cx={r.x}
          cy={r.y}
          r={r.r}
          fill="none"
          stroke="hsl(54, 100%, 50%)"
          strokeWidth="0.75"
          opacity={r.opacity}
        />
      ))}

      {/* Central fold form */}
      <g transform={`translate(${foldX}, ${foldY}) scale(${foldScale})`}>
        <path
          d={`M-30,-20 Q0,${-30 - pressure * 20} 30,-20 L20,20 Q0,${30 + pressure * 15} -20,20 Z`}
          fill="none"
          stroke="hsl(151, 100%, 45%)"
          strokeWidth="1.5"
          opacity={0.5 + pressure * 0.5}
        />
        <path
          d={`M-15,-10 Q0,${-20 - pressure * 10} 15,-10 L10,10 Q0,${15 + pressure * 8} -10,10 Z`}
          fill="none"
          stroke="hsl(151, 100%, 45%)"
          strokeWidth="1"
          opacity={0.3 + pressure * 0.5}
        />
        <circle r="2" fill="hsl(151, 100%, 45%)" opacity={0.6 + pressure * 0.4} />
      </g>

      {/* Pressure indicator line */}
      <line
        x1={mouse.x}
        y1={mouse.y}
        x2={foldX}
        y2={foldY}
        stroke="hsl(50, 10%, 90%)"
        strokeWidth="0.5"
        strokeDasharray="3,3"
        opacity={pressure * 0.5}
      />

      <text x="300" y="390" textAnchor="middle" className="fill-foreground/25 font-mono text-[9px]">
        {pressure > 0.5 ? "responding" : pressure > 0.2 ? "sensing" : "listening"}
      </text>
    </svg>
  );
};

export default FoldBackViz;
