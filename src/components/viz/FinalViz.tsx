import { useState } from "react";

interface FinalVizProps {
  onTriadGenerate?: (a: string, b: string, c: string) => void;
}

const FinalViz = ({ onTriadGenerate }: FinalVizProps) => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!a || !b || !c) return;
    setGenerated(true);
    onTriadGenerate?.(a, b, c);
  };

  if (generated) {
    return (
      <div className="flex flex-col items-center gap-6">
        <svg viewBox="0 0 400 320" className="h-72 w-full">
          {/* Grid */}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="320" stroke="hsl(50, 8%, 88%)" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke="hsl(50, 8%, 88%)" strokeWidth="0.5" />
          ))}

          {/* Triangle — thicker lines */}
          <line x1="200" y1="50" x2="70" y2="250" stroke="hsl(54, 100%, 50%)" strokeWidth="2.5" />
          <line x1="200" y1="50" x2="330" y2="250" stroke="hsl(54, 100%, 50%)" strokeWidth="2.5" />
          <line x1="70" y1="250" x2="330" y2="250" stroke="hsl(0, 0%, 17%)" strokeWidth="1.5" />

          {/* Glow on C edge */}
          <line x1="200" y1="50" x2="70" y2="250" stroke="hsl(54, 100%, 50%)" strokeWidth="8" opacity="0.08" />
          <line x1="200" y1="50" x2="330" y2="250" stroke="hsl(54, 100%, 50%)" strokeWidth="8" opacity="0.08" />

          {/* Nodes */}
          <circle cx="200" cy="50" r="8" fill="hsl(54, 100%, 50%)" />
          <circle cx="70" cy="250" r="7" fill="hsl(0, 0%, 17%)" />
          <circle cx="330" cy="250" r="7" fill="hsl(0, 0%, 17%)" />

          {/* Labels */}
          <text x="200" y="32" textAnchor="middle" fill="hsl(54, 100%, 40%)" fontSize="13" fontFamily="IBM Plex Mono" fontWeight="600">
            {c.toUpperCase()}
          </text>
          <text x="200" y="18" textAnchor="middle" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">C — RELATION</text>
          <text x="50" y="275" textAnchor="middle" fill="hsl(0, 0%, 17%)" fontSize="13" fontFamily="IBM Plex Mono" fontWeight="500">{a}</text>
          <text x="50" y="289" textAnchor="middle" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">A</text>
          <text x="350" y="275" textAnchor="middle" fill="hsl(0, 0%, 17%)" fontSize="13" fontFamily="IBM Plex Mono" fontWeight="500">{b}</text>
          <text x="350" y="289" textAnchor="middle" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">B</text>

          {/* Dimension */}
          <text x="200" y="310" textAnchor="middle" fill="hsl(0, 0%, 55%)" fontSize="8" fontFamily="IBM Plex Mono">
            TRIAD COMPLETE — structure is personal
          </text>
        </svg>

        {/* Output card */}
        <div className="w-full max-w-sm border border-foreground/15 p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/45">Your Triad</p>
            <p className="font-mono text-[9px] text-foreground/35">generated</p>
          </div>
          <p className="mb-5 text-sm text-foreground/65">A relation you can carry.</p>
          <div className="mb-5 grid grid-cols-3 gap-4 border-t border-foreground/10 pt-4">
            <div>
              <p className="font-mono text-[9px] uppercase text-foreground/45">A</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{a}</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-[9px] uppercase text-foreground/45">B</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{b}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[9px] uppercase text-accent">C</p>
              <p className="mt-1 text-sm font-semibold text-accent">{c}</p>
            </div>
          </div>
          <p className="text-xs text-foreground/40 leading-relaxed">
            Structure becomes meaningful when a relation holds and propagates.
          </p>
        </div>

        <button
          onClick={() => { setGenerated(false); setA(""); setB(""); setC(""); }}
          className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/40 hover:text-foreground transition-colors"
        >
          ← reset triad
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        {[
          { label: "A — the self", value: a, set: setA, placeholder: "You" },
          { label: "B — the other", value: b, set: setB, placeholder: "World" },
          { label: "C — the relation", value: c, set: setC, placeholder: "Attention" },
        ].map((field) => (
          <div key={field.label}>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
              {field.label}
            </label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => field.set(e.target.value)}
              placeholder={field.placeholder}
              className="w-full border-b-2 border-ink-faint bg-transparent py-2.5 font-mono text-sm text-foreground outline-none placeholder:text-foreground/25 focus:border-accent transition-colors"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleGenerate}
        disabled={!a || !b || !c}
        className={`mt-1 w-full border-2 py-3 font-mono text-[12px] uppercase tracking-[0.15em] transition-colors ${
          a && b && c
            ? "border-accent text-foreground bg-accent/5 hover:bg-accent hover:text-accent-foreground"
            : "border-ink-faint text-foreground/25 cursor-not-allowed"
        }`}
      >
        Generate Triad
      </button>
    </div>
  );
};

export default FinalViz;
