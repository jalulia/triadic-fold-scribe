import { useEffect, useRef, useState, useCallback } from "react";

interface Point {
  x: number;
  y: number;
  ox: number;
  oy: number;
}

const COLS = 12;
const ROWS = 8;

function createGrid(): Point[] {
  const points: Point[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = 50 + c * 45;
      const y = 50 + r * 45;
      points.push({ x, y, ox: x, oy: y });
    }
  }
  return points;
}

const FoldFieldViz = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<Point[]>(createGrid);
  const [foldCount, setFoldCount] = useState(0);

  const handleMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 600;
    const my = ((e.clientY - rect.top) / rect.height) * 400;

    setPoints((prev) =>
      prev.map((p) => {
        const dist = Math.hypot(p.ox - mx, p.oy - my);
        const strength = Math.max(0, 1 - dist / 120);
        const dx = (p.ox - mx) * strength * 0.3;
        const dy = (p.oy - my) * strength * 0.3;
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

    setPoints((prev) =>
      prev.map((p) => {
        const dist = Math.hypot(p.ox - mx, p.oy - my);
        if (dist < 80) {
          const strength = (1 - dist / 80) * 15;
          return {
            ...p,
            ox: p.ox + (p.ox - mx) * 0.05,
            oy: p.oy + (p.oy - my) * 0.05,
            x: p.ox + (p.ox - mx) * strength * 0.02,
            y: p.oy + (p.oy - my) * strength * 0.02,
          };
        }
        return p;
      })
    );
    setFoldCount((c) => c + 1);
  }, []);

  // Draw horizontal lines
  const hLines: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    const pts = [];
    for (let c = 0; c < COLS; c++) {
      const p = points[r * COLS + c];
      pts.push(`${p.x},${p.y}`);
    }
    hLines.push(pts.join(" "));
  }

  // Draw vertical lines
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
      {hLines.map((pts, i) => (
        <polyline key={`h${i}`} points={pts} fill="none" stroke="hsl(50, 10%, 90%)" strokeWidth="1" />
      ))}
      {vLines.map((pts, i) => (
        <polyline key={`v${i}`} points={pts} fill="none" stroke="hsl(50, 10%, 90%)" strokeWidth="1" />
      ))}
      {points.map((p, i) => {
        const displaced = Math.hypot(p.x - p.ox, p.y - p.oy) > 3;
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={displaced ? 2.5 : 1.5}
            fill={displaced ? "hsl(54, 100%, 50%)" : "hsl(0, 0%, 17%)"}
            opacity={displaced ? 0.8 : 0.3}
          />
        );
      })}
      <text x="300" y="390" textAnchor="middle" className="fill-foreground/25 font-mono text-[9px]">
        {foldCount > 0 ? `${foldCount} fold events` : "move + click to fold"}
      </text>
    </svg>
  );
};

export default FoldFieldViz;
