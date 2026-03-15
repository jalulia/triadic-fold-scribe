import { useEffect, useRef, useState } from "react";

const BananaScaleViz = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [bananaPos, setBananaPos] = useState({ x: 100, y: 250 });
  const [dragging, setDragging] = useState(false);
  const [matched, setMatched] = useState<string[]>([]);

  const targets = [
    { id: "crystal", x: 300, y: 120, label: "Crystal", points: "280,100 320,100 330,140 290,140 270,120" },
    { id: "void", x: 450, y: 200, label: "Void", cx: 450, cy: 200, r: 30 },
    { id: "signal", x: 200, y: 300, label: "Signal" },
  ];

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !dragging) return;
    const handleMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      setBananaPos({
        x: ((e.clientX - rect.left) / rect.width) * 600,
        y: ((e.clientY - rect.top) / rect.height) * 400,
      });
    };
    const handleUp = () => {
      setDragging(false);
      // Check proximity to targets
      targets.forEach((t) => {
        const dist = Math.hypot(bananaPos.x - t.x, bananaPos.y - t.y);
        if (dist < 60 && !matched.includes(t.id)) {
          setMatched((prev) => [...prev, t.id]);
        }
      });
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging, bananaPos, matched]);

  return (
    <svg ref={svgRef} viewBox="0 0 600 400" className="h-full w-full">
      {/* Target: Crystal */}
      <polygon
        points="280,100 320,100 340,140 300,150 270,120"
        fill="none"
        stroke={matched.includes("crystal") ? "hsl(54, 100%, 50%)" : "hsl(50, 10%, 90%)"}
        strokeWidth="1.25"
      />
      <text x="300" y="170" textAnchor="middle" className="fill-foreground/40 font-mono text-[10px]">
        {matched.includes("crystal") ? "≈ 1.2 bananas" : "?"}
      </text>

      {/* Target: Void */}
      <circle
        cx={450}
        cy={200}
        r={30}
        fill="none"
        stroke={matched.includes("void") ? "hsl(54, 100%, 50%)" : "hsl(50, 10%, 90%)"}
        strokeWidth="1.25"
      />
      <text x="450" y="250" textAnchor="middle" className="fill-foreground/40 font-mono text-[10px]">
        {matched.includes("void") ? "≈ 0.3 bananas" : "?"}
      </text>

      {/* Target: Signal */}
      <line x1="170" y1="290" x2="230" y2="310" stroke={matched.includes("signal") ? "hsl(54, 100%, 50%)" : "hsl(50, 10%, 90%)"} strokeWidth="1.25" />
      <line x1="190" y1="280" x2="210" y2="320" stroke={matched.includes("signal") ? "hsl(54, 100%, 50%)" : "hsl(50, 10%, 90%)"} strokeWidth="1.25" />
      <text x="200" y="340" textAnchor="middle" className="fill-foreground/40 font-mono text-[10px]">
        {matched.includes("signal") ? "≈ 2.1 bananas" : "?"}
      </text>

      {/* Banana */}
      <g
        onMouseDown={() => setDragging(true)}
        className="cursor-grab active:cursor-grabbing"
        transform={`translate(${bananaPos.x - 30}, ${bananaPos.y - 10})`}
      >
        <path
          d="M5,15 Q15,0 30,2 Q45,4 55,15 Q50,22 30,20 Q10,20 5,15Z"
          fill="hsl(54, 100%, 50%)"
          stroke="hsl(0, 0%, 17%)"
          strokeWidth="1"
        />
        <text x="20" y="35" className="fill-foreground/60 font-mono text-[8px]">drag me</text>
      </g>

      {/* Measurement ticks */}
      {matched.length > 0 && (
        <text x="300" y="380" textAnchor="middle" className="fill-foreground/30 font-mono text-[9px]">
          {matched.length}/3 measured
        </text>
      )}
    </svg>
  );
};

export default BananaScaleViz;
