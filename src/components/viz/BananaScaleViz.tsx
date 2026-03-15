import { useEffect, useRef, useState } from "react";

const BananaScaleViz = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [bananaPos, setBananaPos] = useState({ x: 120, y: 320 });
  const [dragging, setDragging] = useState(false);
  const [matched, setMatched] = useState<string[]>([]);

  const targets = [
    { id: "crystal", x: 280, y: 100 },
    { id: "void", x: 460, y: 180 },
    { id: "signal", x: 200, y: 220 },
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

  const m = (id: string) => matched.includes(id);
  const activeStroke = "hsl(54, 100%, 45%)";
  const inactiveStroke = "hsl(0, 0%, 28%)";
  const labelFill = "hsl(0, 0%, 28%)";
  const labelActiveFill = "hsl(54, 100%, 35%)";

  return (
    <svg ref={svgRef} viewBox="0 0 600 400" className="h-full w-full">
      {/* Grid */}
      {Array.from({ length: 16 }, (_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="400" stroke="hsl(50, 6%, 85%)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 40} x2="600" y2={i * 40} stroke="hsl(50, 6%, 85%)" strokeWidth="0.5" />
      ))}

      {/* Crystal */}
      <polygon
        points="250,75 310,75 340,120 300,140 240,110"
        fill={m("crystal") ? "hsla(54, 100%, 45%, 0.08)" : "none"}
        stroke={m("crystal") ? activeStroke : inactiveStroke}
        strokeWidth={m("crystal") ? 2.5 : 1.5}
      />
      <line x1="240" y1="66" x2="340" y2="66" stroke={labelFill} strokeWidth="1" strokeDasharray="3,3" />
      <line x1="240" y1="62" x2="240" y2="70" stroke={labelFill} strokeWidth="1" />
      <line x1="340" y1="62" x2="340" y2="70" stroke={labelFill} strokeWidth="1" />
      <text x="290" y="60" textAnchor="middle" fill={m("crystal") ? labelActiveFill : labelFill} fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">
        {m("crystal") ? "≈ 1.2 bn" : "?"}
      </text>
      <text x="290" y="160" textAnchor="middle" fill={labelFill} fontSize="10" fontFamily="IBM Plex Mono" fontWeight="500">CRYSTAL</text>

      {/* Void */}
      <circle cx={460} cy={180} r={35} fill={m("void") ? "hsla(54, 100%, 45%, 0.08)" : "none"} stroke={m("void") ? activeStroke : inactiveStroke} strokeWidth={m("void") ? 2.5 : 1.5} />
      <circle cx={460} cy={180} r={22} fill="none" stroke={m("void") ? activeStroke : inactiveStroke} strokeWidth="1" strokeDasharray="3,3" />
      <text x="460" y="232" textAnchor="middle" fill={m("void") ? labelActiveFill : labelFill} fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">
        {m("void") ? "≈ 0.3 bn" : "?"}
      </text>
      <text x="460" y="248" textAnchor="middle" fill={labelFill} fontSize="10" fontFamily="IBM Plex Mono" fontWeight="500">VOID</text>

      {/* Signal */}
      <line x1="160" y1="205" x2="240" y2="235" stroke={m("signal") ? activeStroke : inactiveStroke} strokeWidth={m("signal") ? 2.5 : 1.5} />
      <line x1="180" y1="195" x2="220" y2="245" stroke={m("signal") ? activeStroke : inactiveStroke} strokeWidth={m("signal") ? 2.5 : 1.5} />
      <circle cx="200" cy="220" r="5" fill={m("signal") ? activeStroke : inactiveStroke} />
      <text x="200" y="270" textAnchor="middle" fill={m("signal") ? labelActiveFill : labelFill} fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">
        {m("signal") ? "≈ 2.1 bn" : "?"}
      </text>
      <text x="200" y="286" textAnchor="middle" fill={labelFill} fontSize="10" fontFamily="IBM Plex Mono" fontWeight="500">SIGNAL</text>

      {/* Banana */}
      <g onMouseDown={() => setDragging(true)} className="cursor-grab active:cursor-grabbing" transform={`translate(${bananaPos.x - 35}, ${bananaPos.y - 12})`}>
        <path d="M5,18 Q18,-2 38,0 Q58,2 68,18 Q62,28 38,26 Q14,26 5,18Z" fill="hsl(54, 100%, 45%)" stroke="hsl(0, 0%, 13%)" strokeWidth="1.5" />
        <path d="M58,4 Q64,0 68,3" fill="none" stroke="hsl(40, 50%, 30%)" strokeWidth="2" />
        <text x="22" y="42" fill="hsl(0, 0%, 28%)" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">↕ DRAG</text>
      </g>

      {/* Status */}
      <rect x="16" y="354" width="180" height="34" fill="hsl(50, 33%, 97%)" stroke="hsl(50, 6%, 78%)" strokeWidth="1.5" />
      <text x="28" y="374" fill="hsl(0, 0%, 28%)" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="500">MEASURED: {matched.length} / 3</text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={148 + i * 14} y={362} width="10" height="10" fill={i < matched.length ? "hsl(54, 100%, 45%)" : "hsl(50, 6%, 85%)"} stroke="hsl(0, 0%, 28%)" strokeWidth="1" />
      ))}
    </svg>
  );
};

export default BananaScaleViz;
