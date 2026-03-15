import { useEffect, useRef, useState } from "react";

const BananaScaleViz = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [bananaPos, setBananaPos] = useState({ x: 120, y: 320 });
  const [dragging, setDragging] = useState(false);
  const [matched, setMatched] = useState<string[]>([]);

  const targets = [
    { id: "crystal", x: 280, y: 100, label: "Crystal" },
    { id: "void", x: 460, y: 180, label: "Void" },
    { id: "signal", x: 200, y: 220, label: "Signal" },
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
      targets.forEach((t) => {
        const dist = Math.hypot(bananaPos.x - t.x, bananaPos.y - t.y);
        if (dist < 70 && !matched.includes(t.id)) {
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

  const isMatched = (id: string) => matched.includes(id);

  return (
    <svg ref={svgRef} viewBox="0 0 600 400" className="h-full w-full">
      {/* Grid */}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="hsl(50, 8%, 88%)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} stroke="hsl(50, 8%, 88%)" strokeWidth="0.5" />
      ))}

      {/* Crystal target */}
      <polygon
        points="250,75 310,75 340,120 300,140 240,110"
        fill={isMatched("crystal") ? "hsla(54, 100%, 50%, 0.06)" : "none"}
        stroke={isMatched("crystal") ? "hsl(54, 100%, 50%)" : "hsl(0, 0%, 17%)"}
        strokeWidth={isMatched("crystal") ? 2.5 : 1.5}
      />
      {/* Dimension lines for crystal */}
      <line x1="240" y1="68" x2="340" y2="68" stroke="hsl(0, 0%, 55%)" strokeWidth="0.75" strokeDasharray="2,2" />
      <line x1="240" y1="65" x2="240" y2="71" stroke="hsl(0, 0%, 55%)" strokeWidth="0.75" />
      <line x1="340" y1="65" x2="340" y2="71" stroke="hsl(0, 0%, 55%)" strokeWidth="0.75" />
      <text x="290" y="64" textAnchor="middle" fill={isMatched("crystal") ? "hsl(54, 100%, 40%)" : "hsl(0, 0%, 55%)"} fontSize="10" fontFamily="IBM Plex Mono" fontWeight="500">
        {isMatched("crystal") ? "≈ 1.2 bn" : "?"}
      </text>
      <text x="290" y="158" textAnchor="middle" fill="hsl(0, 0%, 45%)" fontSize="9" fontFamily="IBM Plex Mono">CRYSTAL</text>

      {/* Void target */}
      <circle cx={460} cy={180} r={35} fill={isMatched("void") ? "hsla(54, 100%, 50%, 0.06)" : "none"} stroke={isMatched("void") ? "hsl(54, 100%, 50%)" : "hsl(0, 0%, 17%)"} strokeWidth={isMatched("void") ? 2.5 : 1.5} />
      <circle cx={460} cy={180} r={20} fill="none" stroke={isMatched("void") ? "hsl(54, 100%, 50%)" : "hsl(0, 0%, 17%)"} strokeWidth="0.75" strokeDasharray="3,3" />
      <text x="460" y="230" textAnchor="middle" fill={isMatched("void") ? "hsl(54, 100%, 40%)" : "hsl(0, 0%, 55%)"} fontSize="10" fontFamily="IBM Plex Mono" fontWeight="500">
        {isMatched("void") ? "≈ 0.3 bn" : "?"}
      </text>
      <text x="460" y="244" textAnchor="middle" fill="hsl(0, 0%, 45%)" fontSize="9" fontFamily="IBM Plex Mono">VOID</text>

      {/* Signal target */}
      <line x1="160" y1="205" x2="240" y2="235" stroke={isMatched("signal") ? "hsl(54, 100%, 50%)" : "hsl(0, 0%, 17%)"} strokeWidth={isMatched("signal") ? 2.5 : 1.5} />
      <line x1="180" y1="195" x2="220" y2="245" stroke={isMatched("signal") ? "hsl(54, 100%, 50%)" : "hsl(0, 0%, 17%)"} strokeWidth={isMatched("signal") ? 2.5 : 1.5} />
      <circle cx="200" cy="220" r="4" fill={isMatched("signal") ? "hsl(54, 100%, 50%)" : "hsl(0, 0%, 17%)"} />
      <text x="200" y="268" textAnchor="middle" fill={isMatched("signal") ? "hsl(54, 100%, 40%)" : "hsl(0, 0%, 55%)"} fontSize="10" fontFamily="IBM Plex Mono" fontWeight="500">
        {isMatched("signal") ? "≈ 2.1 bn" : "?"}
      </text>
      <text x="200" y="282" textAnchor="middle" fill="hsl(0, 0%, 45%)" fontSize="9" fontFamily="IBM Plex Mono">SIGNAL</text>

      {/* Banana (draggable) */}
      <g
        onMouseDown={() => setDragging(true)}
        className="cursor-grab active:cursor-grabbing"
        transform={`translate(${bananaPos.x - 35}, ${bananaPos.y - 12})`}
      >
        {/* Banana shape — bigger, bolder */}
        <path
          d="M5,18 Q18,-2 38,0 Q58,2 68,18 Q62,28 38,26 Q14,26 5,18Z"
          fill="hsl(54, 100%, 50%)"
          stroke="hsl(0, 0%, 17%)"
          strokeWidth="1.5"
        />
        <path d="M58,4 Q64,0 68,3" fill="none" stroke="hsl(40, 60%, 35%)" strokeWidth="1.5" />
        <text x="25" y="42" fill="hsl(0, 0%, 35%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">↕ DRAG</text>
      </g>

      {/* Status bar */}
      <rect x="20" y="360" width="160" height="28" fill="hsl(50, 33%, 97%)" stroke="hsl(50, 8%, 82%)" strokeWidth="1" />
      <text x="30" y="378" fill="hsl(0, 0%, 45%)" fontSize="9" fontFamily="IBM Plex Mono">
        MEASURED: {matched.length} / 3
      </text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={130 + i * 14} y={366} width="10" height="10" fill={i < matched.length ? "hsl(54, 100%, 50%)" : "hsl(50, 8%, 88%)"} stroke="hsl(0, 0%, 17%)" strokeWidth="0.75" />
      ))}
    </svg>
  );
};

export default BananaScaleViz;
