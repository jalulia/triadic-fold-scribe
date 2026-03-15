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
      setMemory((prev) => ({
        x: prev.x * 0.94 + mx * 0.06,
        y: prev.y * 0.94 + my * 0.06,
      }));
      const now = Date.now();
      if (now - lastEmit > 180) {
        lastEmit = now;
        setRipples((prev) => [
          ...prev.slice(-10),
          { id: rippleId++, x: foldX, y: foldY, r: 8, opacity: 0.5 },
        ]);
      }
    };
    svg.addEventListener("mousemove", handleMove);
    return () => svg.removeEventListener("mousemove", handleMove);
  }, [foldX, foldY]);

  useEffect(() => {
    const tick = () => {
      setRipples((prev) =>
        prev
          .map((r) => ({ ...r, r: r.r + 1.2, opacity: r.opacity * 0.97 }))
          .filter((r) => r.opacity > 0.03)
      );
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const dist = Math.hypot(mouse.x - 300, mouse.y - 200);
  const pressure = Math.max(0, 1 - dist / 200);
  const foldScale = 1 + pressure * 0.4;
  const state = pressure > 0.5 ? "responding" : pressure > 0.2 ? "sensing" : "listening";

  return (
    <svg ref={svgRef} viewBox="0 0 600 400" className="h-full w-full cursor-crosshair">
      {/* Grid */}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="hsl(50, 8%, 88%)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} stroke="hsl(50, 8%, 88%)" strokeWidth="0.5" />
      ))}

      {/* Proximity ring */}
      <circle cx="300" cy="200" r="200" fill="none" stroke="hsl(0, 0%, 17%)" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.15" />
      <circle cx="300" cy="200" r="100" fill="none" stroke="hsl(0, 0%, 17%)" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.2" />

      {/* Ripples */}
      {ripples.map((r) => (
        <circle
          key={r.id}
          cx={r.x}
          cy={r.y}
          r={r.r}
          fill="none"
          stroke="hsl(151, 100%, 45%)"
          strokeWidth="1.25"
          opacity={r.opacity}
        />
      ))}

      {/* Pressure line */}
      {pressure > 0.05 && (
        <line
          x1={mouse.x}
          y1={mouse.y}
          x2={foldX}
          y2={foldY}
          stroke="hsl(0, 0%, 17%)"
          strokeWidth="0.75"
          strokeDasharray="3,3"
          opacity={pressure * 0.4}
        />
      )}

      {/* Central fold form */}
      <g transform={`translate(${foldX}, ${foldY}) scale(${foldScale})`}>
        {/* Outer envelope */}
        <path
          d={`M-40,-28 Q0,${-42 - pressure * 25} 40,-28 L28,28 Q0,${42 + pressure * 20} -28,28 Z`}
          fill="none"
          stroke="hsl(151, 100%, 45%)"
          strokeWidth="2"
          opacity={0.4 + pressure * 0.6}
        />
        {/* Inner fold */}
        <path
          d={`M-22,-15 Q0,${-28 - pressure * 14} 22,-15 L15,15 Q0,${22 + pressure * 10} -15,15 Z`}
          fill={`hsla(151, 100%, 45%, ${pressure * 0.08})`}
          stroke="hsl(151, 100%, 45%)"
          strokeWidth="1.5"
          opacity={0.3 + pressure * 0.7}
        />
        {/* Core */}
        <circle r="4" fill="hsl(151, 100%, 45%)" opacity={0.5 + pressure * 0.5} />
        {/* Crosshair */}
        <line x1="-10" y1="0" x2="10" y2="0" stroke="hsl(151, 100%, 45%)" strokeWidth="0.75" opacity="0.4" />
        <line x1="0" y1="-10" x2="0" y2="10" stroke="hsl(151, 100%, 45%)" strokeWidth="0.75" opacity="0.4" />
      </g>

      {/* Status */}
      <rect x="20" y="20" width="150" height="50" fill="hsl(50, 33%, 97%)" stroke="hsl(50, 8%, 82%)" strokeWidth="1" />
      <text x="30" y="38" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">AGENT STATE</text>
      <text x="30" y="55" fill="hsl(151, 100%, 35%)" fontSize="14" fontFamily="IBM Plex Mono" fontWeight="600">{state}</text>
      <text x="30" y="65" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">pressure: {(pressure * 100).toFixed(0)}%</text>
    </svg>
  );
};

export default FoldBackViz;
