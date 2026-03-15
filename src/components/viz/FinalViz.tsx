import { useState } from "react";

interface FinalVizProps { onTriadGenerate?: (a: string, b: string, c: string) => void; }

const FinalViz = ({ onTriadGenerate }: FinalVizProps) => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => { if (!a || !b || !c) return; setGenerated(true); onTriadGenerate?.(a, b, c); };

  if (generated) {
    return (
      <div className="flex flex-col items-center gap-6">
        <svg viewBox="0 0 400 320" className="h-72 w-full">
          {Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="320" stroke="hsl(50, 6%, 85%)" strokeWidth="0.5" />)}
          {Array.from({ length: 9 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="hsl(50, 6%, 85%)" strokeWidth="0.5" />)}

          <line x1="200" y1="50" x2="70" y2="250" stroke="hsl(54, 100%, 45%)" strokeWidth="3" />
          <line x1="200" y1="50" x2="330" y2="250" stroke="hsl(54, 100%, 45%)" strokeWidth="3" />
          <line x1="70" y1="250" x2="330" y2="250" stroke="hsl(0, 0%, 13%)" strokeWidth="2" />
          <line x1="200" y1="50" x2="70" y2="250" stroke="hsl(54, 100%, 45%)" strokeWidth="10" opacity="0.1" />
          <line x1="200" y1="50" x2="330" y2="250" stroke="hsl(54, 100%, 45%)" strokeWidth="10" opacity="0.1" />

          <circle cx="200" cy="50" r="9" fill="hsl(54, 100%, 45%)" />
          <circle cx="70" cy="250" r="8" fill="hsl(0, 0%, 13%)" />
          <circle cx="330" cy="250" r="8" fill="hsl(0, 0%, 13%)" />

          <text x="200" y="30" textAnchor="middle" fill="hsl(54, 100%, 35%)" fontSize="14" fontFamily="IBM Plex Mono" fontWeight="700">{c.toUpperCase()}</text>
          <text x="200" y="16" textAnchor="middle" fill="hsl(0, 0%, 42%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">C — RELATION</text>
          <text x="50" y="278" textAnchor="middle" fill="hsl(0, 0%, 13%)" fontSize="14" fontFamily="IBM Plex Mono" fontWeight="600">{a}</text>
          <text x="50" y="294" textAnchor="middle" fill="hsl(0, 0%, 42%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">A</text>
          <text x="350" y="278" textAnchor="middle" fill="hsl(0, 0%, 13%)" fontSize="14" fontFamily="IBM Plex Mono" fontWeight="600">{b}</text>
          <text x="350" y="294" textAnchor="middle" fill="hsl(0, 0%, 42%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">B</text>
          <text x="200" y="312" textAnchor="middle" fill="hsl(0, 0%, 42%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="500">TRIAD COMPLETE — structure is personal</text>
        </svg>

        <div className="w-full max-w-sm border-2 border-ink-faint p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-strong font-semibold">Your Triad</p>
            <p className="font-mono text-[9px] text-ink-medium font-medium">generated</p>
          </div>
          <p className="mb-5 text-sm text-ink-strong">A relation you can carry.</p>
          <div className="mb-5 grid grid-cols-3 gap-4 border-t-2 border-ink-faint pt-4">
            <div><p className="font-mono text-[10px] uppercase text-ink-medium font-medium">A</p><p className="mt-1 text-sm font-bold text-foreground">{a}</p></div>
            <div className="text-center"><p className="font-mono text-[10px] uppercase text-ink-medium font-medium">B</p><p className="mt-1 text-sm font-bold text-foreground">{b}</p></div>
            <div className="text-right"><p className="font-mono text-[10px] uppercase text-accent font-semibold">C</p><p className="mt-1 text-sm font-bold text-accent">{c}</p></div>
          </div>
          <p className="text-xs text-ink-strong leading-relaxed">Structure becomes meaningful when a relation holds and propagates.</p>
        </div>

        <button onClick={() => { setGenerated(false); setA(""); setB(""); setC(""); }}
          className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-medium hover:text-foreground transition-colors font-medium">← reset triad</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {[
        { label: "A — the self", value: a, set: setA, placeholder: "You" },
        { label: "B — the other", value: b, set: setB, placeholder: "World" },
        { label: "C — the relation", value: c, set: setC, placeholder: "Attention" },
      ].map((f) => (
        <div key={f.label}>
          <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-ink-strong font-semibold">{f.label}</label>
          <input type="text" value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder}
            className="w-full border-b-2 border-ink-faint bg-transparent py-2.5 font-mono text-sm text-foreground outline-none placeholder:text-ink-faint focus:border-accent transition-colors font-medium" />
        </div>
      ))}
      <button onClick={handleGenerate} disabled={!a || !b || !c}
        className={`mt-2 w-full border-2 py-3 font-mono text-[12px] uppercase tracking-[0.15em] transition-colors font-semibold ${
          a && b && c ? "border-accent text-foreground bg-accent/5 hover:bg-accent hover:text-accent-foreground" : "border-ink-faint text-ink-faint cursor-not-allowed"
        }`}>Generate Triad</button>
    </div>
  );
};

export default FinalViz;
