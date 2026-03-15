import { useEffect, useRef, useState } from "react";
import { VIZ, SvgGrid, ReadoutPanel } from "./shared";

interface Ripple { id: number; x: number; y: number; r: number; opacity: number; }
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
      setMemory(prev => ({ x: prev.x * 0.94 + mx * 0.06, y: prev.y * 0.94 + my * 0.06 }));
      const now = Date.now();
      if (now - lastEmit > 180) {
        lastEmit = now;
        setRipples(prev => [...prev.slice(-10), { id: rippleId++, x: foldX, y: foldY, r: 8, opacity: 0.6 }]);
      }
    };
    svg.addEventListener("mousemove", handleMove);
    return () => svg.removeEventListener("mousemove", handleMove);
  }, [foldX, foldY]);

  useEffect(() => {
    const tick = () => {
      setRipples(prev => prev.map(r => ({ ...r, r: r.r + 1.2, opacity: r.opacity * 0.97 })).filter(r => r.opacity > 0.03));
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
      <SvgGrid />

      <circle cx="300" cy="200" r="200" fill="none" stroke={VIZ.inkStrong} strokeWidth="0.75" strokeDasharray="4,4" opacity="0.2" />
      <circle cx="300" cy="200" r="100" fill="none" stroke={VIZ.inkStrong} strokeWidth="0.75" strokeDasharray="4,4" opacity="0.3" />

      {ripples.map(r => <circle key={r.id} cx={r.x} cy={r.y} r={r.r} fill="none" stroke={VIZ.green} strokeWidth="1.5" opacity={r.opacity} />)}

      {pressure > 0.05 && <line x1={mouse.x} y1={mouse.y} x2={foldX} y2={foldY} stroke={VIZ.inkStrong} strokeWidth="1" strokeDasharray="4,4" opacity={pressure * 0.4} />}

      <g transform={`translate(${foldX}, ${foldY}) scale(${foldScale})`}>
        <path d={`M-42,-30 Q0,${-45 - pressure * 28} 42,-30 L30,30 Q0,${45 + pressure * 22} -30,30 Z`} fill="none" stroke={VIZ.green} strokeWidth="2.5" opacity={0.4 + pressure * 0.6} />
        <path d={`M-24,-16 Q0,${-30 - pressure * 16} 24,-16 L16,16 Q0,${24 + pressure * 12} -16,16 Z`} fill={`hsla(151,100%,38%,${pressure * 0.1})`} stroke={VIZ.green} strokeWidth="1.75" opacity={0.3 + pressure * 0.7} />
        <circle r="5" fill={VIZ.green} opacity={0.5 + pressure * 0.5} />
        <line x1="-12" y1="0" x2="12" y2="0" stroke={VIZ.green} strokeWidth="1" opacity="0.5" />
        <line x1="0" y1="-12" x2="0" y2="12" stroke={VIZ.green} strokeWidth="1" opacity="0.5" />
      </g>

      <ReadoutPanel x={12} y={12} w={176} h={58}>
        <text x="24" y="30" fill={VIZ.inkMedium} fontSize="9" fontFamily={VIZ.mono}>AGENT STATE</text>
        <text x="24" y="52" fill={VIZ.greenDim} fontSize="18" fontFamily={VIZ.display} fontWeight="900">{state}</text>
        <text x="24" y="64" fill={VIZ.inkMedium} fontSize="9" fontFamily={VIZ.mono}>pressure: {(pressure * 100).toFixed(0)}%</text>
      </ReadoutPanel>
    </svg>
  );
};

export default FoldBackViz;
