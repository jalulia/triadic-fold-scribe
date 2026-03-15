import { useEffect, useRef, useState } from "react";
import { VIZ, SvgGrid, ReadoutPanel } from "./shared";

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
    if (!svgRef.current || !dragging) return;
    const svg = svgRef.current;
    const handleMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      setBananaPos({ x: ((e.clientX - rect.left) / rect.width) * 600, y: ((e.clientY - rect.top) / rect.height) * 400 });
    };
    const handleUp = () => {
      setDragging(false);
      targets.forEach((t) => {
        if (Math.hypot(bananaPos.x - t.x, bananaPos.y - t.y) < 70 && !matched.includes(t.id))
          setMatched((prev) => [...prev, t.id]);
      });
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
  }, [dragging, bananaPos, matched]);

  const m = (id: string) => matched.includes(id);
  const active = VIZ.yellow;
  const inactive = VIZ.inkStrong;

  return (
    <svg ref={svgRef} viewBox="0 0 600 400" className="h-full w-full">
      <SvgGrid />

      {/* Crystal */}
      <polygon points="250,75 310,75 340,120 300,140 240,110" fill={m("crystal") ? "hsla(54,100%,50%,0.06)" : "none"} stroke={m("crystal") ? active : inactive} strokeWidth={m("crystal") ? 2.5 : 1.5} />
      <line x1="240" y1="66" x2="340" y2="66" stroke={VIZ.inkStrong} strokeWidth="1" strokeDasharray="3,3" />
      <line x1="240" y1="62" x2="240" y2="70" stroke={VIZ.inkStrong} strokeWidth="1" />
      <line x1="340" y1="62" x2="340" y2="70" stroke={VIZ.inkStrong} strokeWidth="1" />
      <text x="290" y="60" textAnchor="middle" fill={m("crystal") ? VIZ.yellowDim : VIZ.inkStrong} fontSize="11" fontFamily={VIZ.mono} fontWeight="700">{m("crystal") ? "≈ 1.2 bn" : "?"}</text>
      <text x="290" y="160" textAnchor="middle" fill={VIZ.inkMedium} fontSize="10" fontFamily={VIZ.mono}>CRYSTAL</text>

      {/* Void */}
      <circle cx={460} cy={180} r={35} fill={m("void") ? "hsla(54,100%,50%,0.06)" : "none"} stroke={m("void") ? active : inactive} strokeWidth={m("void") ? 2.5 : 1.5} />
      <circle cx={460} cy={180} r={22} fill="none" stroke={m("void") ? active : inactive} strokeWidth="1" strokeDasharray="3,3" />
      <text x="460" y="232" textAnchor="middle" fill={m("void") ? VIZ.yellowDim : VIZ.inkStrong} fontSize="11" fontFamily={VIZ.mono} fontWeight="700">{m("void") ? "≈ 0.3 bn" : "?"}</text>
      <text x="460" y="248" textAnchor="middle" fill={VIZ.inkMedium} fontSize="10" fontFamily={VIZ.mono}>VOID</text>

      {/* Signal */}
      <line x1="160" y1="205" x2="240" y2="235" stroke={m("signal") ? active : inactive} strokeWidth={m("signal") ? 2.5 : 1.5} />
      <line x1="180" y1="195" x2="220" y2="245" stroke={m("signal") ? active : inactive} strokeWidth={m("signal") ? 2.5 : 1.5} />
      <circle cx="200" cy="220" r="5" fill={m("signal") ? active : inactive} />
      <text x="200" y="270" textAnchor="middle" fill={m("signal") ? VIZ.yellowDim : VIZ.inkStrong} fontSize="11" fontFamily={VIZ.mono} fontWeight="700">{m("signal") ? "≈ 2.1 bn" : "?"}</text>
      <text x="200" y="286" textAnchor="middle" fill={VIZ.inkMedium} fontSize="10" fontFamily={VIZ.mono}>SIGNAL</text>

      {/* Banana */}
      <g onMouseDown={() => setDragging(true)} className="cursor-grab active:cursor-grabbing" transform={`translate(${bananaPos.x - 35}, ${bananaPos.y - 12})`}>
        <path d="M5,18 Q18,-2 38,0 Q58,2 68,18 Q62,28 38,26 Q14,26 5,18Z" fill={VIZ.yellow} stroke={VIZ.ink} strokeWidth="1.5" />
        <path d="M58,4 Q64,0 68,3" fill="none" stroke="hsl(40,50%,30%)" strokeWidth="2" />
        <text x="22" y="42" fill={VIZ.inkStrong} fontSize="10" fontFamily={VIZ.mono} fontWeight="700">↕ DRAG</text>
      </g>

      <ReadoutPanel x={12} y={354} w={184} h={36}>
        <text x="24" y="376" fill={VIZ.inkStrong} fontSize="10" fontFamily={VIZ.mono}>MEASURED: {matched.length} / 3</text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={152 + i * 14} y={362} width="10" height="10" fill={i < matched.length ? VIZ.yellow : VIZ.ruleDim} stroke={VIZ.inkStrong} strokeWidth="1" />
        ))}
      </ReadoutPanel>
    </svg>
  );
};

export default BananaScaleViz;
