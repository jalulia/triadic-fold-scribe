import { useEffect, useRef, useState } from "react";

const CalibrationViz = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mouse, setMouse] = useState({ x: 300, y: 200 });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handleMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - rect.left) / rect.width) * 600,
        y: ((e.clientY - rect.top) / rect.height) * 400,
      });
    };
    svg.addEventListener("mousemove", handleMove);
    return () => svg.removeEventListener("mousemove", handleMove);
  }, []);

  const ax = 150, ay = 200;
  const bx = 450, by = 200;
  const cx = mouse.x * 0.3 + 300 * 0.7;
  const cy = mouse.y * 0.3 + 120 * 0.7;

  return (
    <svg ref={svgRef} viewBox="0 0 600 400" className="h-full w-full cursor-crosshair">
      <path
        d={`M${ax},${ay} Q${cx},${cy} ${bx},${by}`}
        fill="none"
        stroke="hsl(54, 100%, 50%)"
        strokeWidth="1.75"
        className="transition-all duration-100"
      />
      <circle cx={ax} cy={ay} r="4" className="fill-foreground" />
      <circle cx={bx} cy={by} r="4" className="fill-foreground" />
      <circle cx={cx} cy={cy} r="2.5" className="fill-accent opacity-60" />
      {/* Grid lines */}
      {[100, 200, 300, 400, 500].map((x) => (
        <line key={x} x1={x} y1="50" x2={x} y2="350" stroke="hsl(50, 10%, 90%)" strokeWidth="0.5" />
      ))}
      {[100, 200, 300].map((y) => (
        <line key={y} x1="50" y1={y} x2="550" y2={y} stroke="hsl(50, 10%, 90%)" strokeWidth="0.5" />
      ))}
    </svg>
  );
};

export default CalibrationViz;
