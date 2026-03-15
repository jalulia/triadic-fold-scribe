import { useRef, useState, useCallback } from "react";

interface Point { x: number; y: number; ox: number; oy: number; }

const COLS = 14, ROWS = 9;
function createGrid(): Point[] {
  const points: Point[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const x = 20 + c * 40, y = 20 + r * 40;
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
    setPoints((prev) => prev.map((p) => {
      const dist = Math.hypot(p.ox - mx, p.oy - my);
      const strength = Math.max(0, 1 - dist / 100);
      return { ...p, x: p.ox + (p.ox - mx) * strength * 0.35, y: p.oy + (p.oy - my) * strength * 0.35 };
    }));
  }, [getPos]);

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const { x: mx, y: my } = getPos(e);
    setLastFold({ x: mx, y: my });
    setPoints((prev) => prev.map((p) => {
      const dist = Math.hypot(p.ox - mx, p.oy - my);
      if (dist < 90) {
        return { ...p, ox: p.ox + (p.ox - mx) * 0.04, oy: p.oy + (p.oy - my) * 0.04, x: p.ox + (p.ox - mx) * (1 - dist / 90) * 0.24, y: p.oy + (p.oy - my) * (1 - dist / 90) * 0.24 };
      }
      return p;
    }));
    setFoldCount((c) => c + 1);
  }, [getPos]);

  const hLines: string[] = [], vLines: string[] = [];
  for (let r = 0; r < ROWS; r++) { const pts = []; for (let c = 0; c < COLS; c++) { const p = points[r * COLS + c]; pts.push(`${p.x},${p.y}`); } hLines.push(pts.join(" ")); }
  for (let c = 0; c < COLS; c++) { const pts = []; for (let r = 0; r < ROWS; r++) { const p = points[r * COLS + c]; pts.push(`${p.x},${p.y}`); } vLines.push(pts.join(" ")); }

  const displaced = points.filter(p => Math.hypot(p.x - p.ox, p.y - p.oy) > 2).length;

  return (
    <svg ref={svgRef} viewBox="0 0 600 400" className="h-full w-full cursor-crosshair" onMouseMove={handleMove} onClick={handleClick}>
      {hLines.map((pts, i) => <polyline key={`h${i}`} points={pts} fill="none" stroke="hsl(0, 0%, 13%)" strokeWidth="0.75" opacity="0.3" />)}
      {vLines.map((pts, i) => <polyline key={`v${i}`} points={pts} fill="none" stroke="hsl(0, 0%, 13%)" strokeWidth="0.75" opacity="0.3" />)}
      {points.map((p, i) => {
        const d = Math.hypot(p.x - p.ox, p.y - p.oy) > 2;
        return <circle key={i} cx={p.x} cy={p.y} r={d ? 4 : 2} fill={d ? "hsl(54, 100%, 45%)" : "hsl(0, 0%, 13%)"} opacity={d ? 1 : 0.35} />;
      })}
      {lastFold && (
        <>
          <circle cx={lastFold.x} cy={lastFold.y} r="35" fill="none" stroke="hsl(54, 100%, 45%)" strokeWidth="1.5" opacity="0.35" strokeDasharray="4,4" />
          <line x1={lastFold.x - 8} y1={lastFold.y} x2={lastFold.x + 8} y2={lastFold.y} stroke="hsl(54, 100%, 45%)" strokeWidth="2" />
          <line x1={lastFold.x} y1={lastFold.y - 8} x2={lastFold.x} y2={lastFold.y + 8} stroke="hsl(54, 100%, 45%)" strokeWidth="2" />
        </>
      )}
      <rect x="16" y="346" width="220" height="42" fill="hsl(50, 33%, 97%)" stroke="hsl(50, 6%, 78%)" strokeWidth="1.5" />
      <text x="28" y="364" fill="hsl(0, 0%, 42%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">FOLD EVENTS</text>
      <text x="120" y="364" fill="hsl(0, 0%, 13%)" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="700">{foldCount}</text>
      <text x="28" y="380" fill="hsl(0, 0%, 28%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">
        {foldCount === 0 ? "hover + click to create folds" : `${displaced} nodes displaced`}
      </text>
    </svg>
  );
};

export default FoldFieldViz;
