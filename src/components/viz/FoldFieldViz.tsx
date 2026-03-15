import { useRef, useState, useCallback } from "react";
import { VIZ, SvgGrid, ReadoutPanel } from "./shared";

interface Point { x: number; y: number; ox: number; oy: number; }
const COLS = 14, ROWS = 9, STEP = 44;

function createGrid(): Point[] {
  const points: Point[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const x = 10 + c * STEP, y = 6 + r * STEP;
      points.push({ x, y, ox: x, oy: y });
    }
  return points;
}

const FoldFieldViz = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<Point[]>(createGrid);
  const [foldCount, setFoldCount] = useState(0);
  const [lastFold, setLastFold] = useState<{ x: number; y: number } | null>(null);

  const getPos = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * 600, y: ((e.clientY - rect.top) / rect.height) * 400 };
  }, []);

  const handleMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const { x: mx, y: my } = getPos(e);
    setPoints(prev => prev.map(p => {
      const dist = Math.hypot(p.ox - mx, p.oy - my);
      const s = Math.max(0, 1 - dist / 100);
      return { ...p, x: p.ox + (p.ox - mx) * s * 0.35, y: p.oy + (p.oy - my) * s * 0.35 };
    }));
  }, [getPos]);

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const { x: mx, y: my } = getPos(e);
    setLastFold({ x: mx, y: my });
    setPoints(prev => prev.map(p => {
      const dist = Math.hypot(p.ox - mx, p.oy - my);
      if (dist < 90) {
        const s = (1 - dist / 90);
        return { ...p, ox: p.ox + (p.ox - mx) * 0.04, oy: p.oy + (p.oy - my) * 0.04, x: p.ox + (p.ox - mx) * s * 0.24, y: p.oy + (p.oy - my) * s * 0.24 };
      }
      return p;
    }));
    setFoldCount(c => c + 1);
  }, [getPos]);

  const hLines: string[] = [], vLines: string[] = [];
  for (let r = 0; r < ROWS; r++) { const pts = []; for (let c = 0; c < COLS; c++) { const p = points[r * COLS + c]; pts.push(`${p.x},${p.y}`); } hLines.push(pts.join(" ")); }
  for (let c = 0; c < COLS; c++) { const pts = []; for (let r = 0; r < ROWS; r++) { const p = points[r * COLS + c]; pts.push(`${p.x},${p.y}`); } vLines.push(pts.join(" ")); }

  const displaced = points.filter(p => Math.hypot(p.x - p.ox, p.y - p.oy) > 2).length;

  return (
    <svg ref={svgRef} viewBox="0 0 600 400" className="h-full w-full cursor-crosshair" onMouseMove={handleMove} onClick={handleClick}>
      {hLines.map((pts, i) => <polyline key={`h${i}`} points={pts} fill="none" stroke={VIZ.ink} strokeWidth="0.75" opacity="0.25" />)}
      {vLines.map((pts, i) => <polyline key={`v${i}`} points={pts} fill="none" stroke={VIZ.ink} strokeWidth="0.75" opacity="0.25" />)}
      {points.map((p, i) => {
        const d = Math.hypot(p.x - p.ox, p.y - p.oy) > 2;
        return <circle key={i} cx={p.x} cy={p.y} r={d ? 4 : 2} fill={d ? VIZ.yellow : VIZ.ink} opacity={d ? 1 : 0.3} />;
      })}
      {lastFold && (
        <>
          <circle cx={lastFold.x} cy={lastFold.y} r="35" fill="none" stroke={VIZ.yellow} strokeWidth="1.5" opacity="0.3" strokeDasharray="4,4" />
          <line x1={lastFold.x - 8} y1={lastFold.y} x2={lastFold.x + 8} y2={lastFold.y} stroke={VIZ.yellow} strokeWidth="2" />
          <line x1={lastFold.x} y1={lastFold.y - 8} x2={lastFold.x} y2={lastFold.y + 8} stroke={VIZ.yellow} strokeWidth="2" />
        </>
      )}
      <ReadoutPanel x={12} y={346} w={224} h={44}>
        <text x="24" y="364" fill={VIZ.inkMedium} fontSize="9" fontFamily={VIZ.mono}>FOLD EVENTS</text>
        <text x="120" y="364" fill={VIZ.ink} fontSize="13" fontFamily={VIZ.mono} fontWeight="700">{foldCount}</text>
        <text x="24" y="380" fill={VIZ.inkStrong} fontSize="9" fontFamily={VIZ.mono}>
          {foldCount === 0 ? "hover + click to create folds" : `${displaced} nodes displaced`}
        </text>
      </ReadoutPanel>
    </svg>
  );
};

export default FoldFieldViz;
