import { useRef, useState, useCallback } from "react";

interface Point {
  x: number;
  y: number;
  ox: number;
  oy: number;
}

const COLS = 14;
const ROWS = 9;

function createGrid(): Point[] {
  const points: Point[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = 30 + c * 40;
      const y = 30 + r * 40;
      points.push({ x, y, ox: x, oy: y });
    }
  }
  return points;
}

const FoldFieldViz = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<Point[]>(createGrid);
  const [foldCount, setFoldCount] = useState(0);
  const [lastFold, setLastFold] = useState<{ x: number; y: number } | null>(null);

  const handleMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 600;
    const my = ((e.clientY - rect.top) / rect.height) * 400;

    setPoints((prev) =>
      prev.map((p) => {
        const dist = Math.hypot(p.ox - mx, p.oy - my);
        const strength = Math.max(0, 1 - dist / 100);
        const dx = (p.ox - mx) * strength * 0.35;
        const dy = (p.oy - my) * strength * 0.35;
        return { ...p, x: p.ox + dx, y: p.oy + dy };
      })
    );
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 600;
    const my = ((e.clientY - rect.top) / rect.height) * 400;

    setLastFold({ x: mx, y: my });
    setPoints((prev) =>
      prev.map((p) => {
        const dist = Math.hypot(p.ox - mx, p.oy - my);
        if (dist < 90) {
          const strength = (1 - dist / 90) * 12;
          return {
            ...p,
            ox: p.ox + (p.ox - mx) * 0.04,
            oy: p.oy + (p.oy - my) * 0.04,
            x: p.ox + (p.ox - mx) * strength * 0.02,
            y: p.oy + (p.oy - my) * strength * 0.02,
          };
        }
        return p;
      })
    );
    setFoldCount((c) => c + 1);
  }, []);

  // Build line paths
  const hLines: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    const pts = [];
    for (let c = 0; c < COLS; c++) {
      const p = points[r * COLS + c];
      pts.push(`${p.x},${p.y}`);
    }
    hLines.push(pts.join(" "));
  }
  const vLines: string[] = [];
  for (let c = 0; c < COLS; c++) {
    const pts = [];
    for (let r = 0; r < ROWS; r++) {
      const p = points[r * COLS + c];
      pts.push(`${p.x},${p.y}`);
    }
    vLines.push(pts.join(" "));
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 400"
      className="h-full w-full cursor-crosshair"
      onMouseMove={handleMove}
      onClick={handleClick}
    >
      {/* Mesh lines */}
      {hLines.map((pts, i) => (
        <polyline key={`h${i}`} points={pts} fill="none" stroke="hsl(0, 0%, 17%)" strokeWidth="0.75" opacity="0.35" />
      ))}
      {vLines.map((pts, i) => (
        <polyline key={`v${i}`} points={pts} fill="none" stroke="hsl(0, 0%, 17%)" strokeWidth="0.75" opacity="0.35" />
      ))}

      {/* Nodes */}
      {points.map((p, i) => {
        const displaced = Math.hypot(p.x - p.ox, p.y - p.oy) > 2;
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={displaced ? 3.5 : 2}
            fill={displaced ? "hsl(54, 100%, 50%)" : "hsl(0, 0%, 17%)"}
            opacity={displaced ? 1 : 0.4}
          />
        );
      })}

      {/* Last fold marker */}
      {lastFold && (
        <>
          <circle cx={lastFold.x} cy={lastFold.y} r="30" fill="none" stroke="hsl(54, 100%, 50%)" strokeWidth="1" opacity="0.3" strokeDasharray="4,4" />
          <line x1={lastFold.x - 6} y1={lastFold.y} x2={lastFold.x + 6} y2={lastFold.y} stroke="hsl(54, 100%, 50%)" strokeWidth="1.5" />
          <line x1={lastFold.x} y1={lastFold.y - 6} x2={lastFold.x} y2={lastFold.y + 6} stroke="hsl(54, 100%, 50%)" strokeWidth="1.5" />
        </>
      )}

      {/* Readout */}
      <rect x="20" y="350" width="180" height="36" fill="hsl(50, 33%, 97%)" stroke="hsl(50, 8%, 82%)" strokeWidth="1" />
      <text x="30" y="366" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">FOLD EVENTS</text>
      <text x="120" y="366" fill="hsl(0, 0%, 17%)" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">{foldCount}</text>
      <text x="30" y="378" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">
        {foldCount === 0 ? "move cursor + click to fold" : `displaced: ${points.filter(p => Math.hypot(p.x - p.ox, p.y - p.oy) > 2).length} nodes`}
      </text>
    </svg>
  );
};

export default FoldFieldViz;
