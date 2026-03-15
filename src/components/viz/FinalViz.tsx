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
        {/* Triad SVG */}
        <svg viewBox="0 0 400 300" className="h-64 w-full">
          {/* Triangle */}
          <line x1="200" y1="60" x2="80" y2="240" stroke="hsl(54, 100%, 50%)" strokeWidth="1.25" />
          <line x1="200" y1="60" x2="320" y2="240" stroke="hsl(54, 100%, 50%)" strokeWidth="1.25" />
          <line x1="80" y1="240" x2="320" y2="240" stroke="hsl(54, 100%, 50%)" strokeWidth="1.25" />

          {/* Nodes */}
          <circle cx="200" cy="60" r="5" fill="hsl(54, 100%, 50%)" />
          <circle cx="80" cy="240" r="5" fill="hsl(0, 0%, 17%)" />
          <circle cx="320" cy="240" r="5" fill="hsl(0, 0%, 17%)" />

          {/* Labels */}
          <text x="200" y="45" textAnchor="middle" className="fill-accent font-mono text-[12px] font-medium uppercase">
            {c}
          </text>
          <text x="65" y="265" textAnchor="middle" className="fill-foreground font-mono text-[12px]">
            {a}
          </text>
          <text x="335" y="265" textAnchor="middle" className="fill-foreground font-mono text-[12px]">
            {b}
          </text>
        </svg>

        {/* Output card */}
        <div className="w-full max-w-sm border border-ink-faint p-6">
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40">
            Your Triad
          </p>
          <p className="mb-4 text-sm text-foreground/60">
            A relation you can carry
          </p>
          <div className="mb-4 flex justify-between border-t border-ink-faint pt-4">
            <div>
              <p className="font-mono text-[9px] uppercase text-foreground/40">A</p>
              <p className="text-sm font-medium">{a}</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-[9px] uppercase text-foreground/40">B</p>
              <p className="text-sm font-medium">{b}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[9px] uppercase text-accent">C</p>
              <p className="text-sm font-medium text-accent">{c}</p>
            </div>
          </div>
          <p className="text-xs text-foreground/40">
            Structure becomes meaningful when a relation holds and propagates.
          </p>
        </div>

        <button
          onClick={() => { setGenerated(false); setA(""); setB(""); setC(""); }}
          className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/40 hover:text-foreground/60"
        >
          reset
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div>
          <label className="mb-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40">
            A — the self
          </label>
          <input
            type="text"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="You"
            className="w-full border-b border-ink-faint bg-transparent py-2 font-mono text-sm text-foreground outline-none placeholder:text-foreground/20 focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40">
            B — the other
          </label>
          <input
            type="text"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="World"
            className="w-full border-b border-ink-faint bg-transparent py-2 font-mono text-sm text-foreground outline-none placeholder:text-foreground/20 focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40">
            C — the relation
          </label>
          <input
            type="text"
            value={c}
            onChange={(e) => setC(e.target.value)}
            placeholder="Attention"
            className="w-full border-b border-ink-faint bg-transparent py-2 font-mono text-sm text-foreground outline-none placeholder:text-foreground/20 focus:border-accent"
          />
        </div>
      </div>
      <button
        onClick={handleGenerate}
        disabled={!a || !b || !c}
        className={`mt-2 w-full border py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
          a && b && c
            ? "border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            : "border-ink-faint text-foreground/20 cursor-not-allowed"
        }`}
      >
        Generate
      </button>
    </div>
  );
};

export default FinalViz;
