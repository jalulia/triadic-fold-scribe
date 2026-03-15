import { SCENES } from "@/data/scenes";

interface ConsoleProps {
  activeScene: string;
  consoleData: Record<string, string>;
}

const StructuralConsole = ({ activeScene, consoleData }: ConsoleProps) => {
  const scene = SCENES.find((s) => s.id === activeScene);
  const mode = scene?.consoleMode || "trp-minimal";

  const renderStage = () => {
    switch (mode) {
      case "trp-minimal":
        return (
          <svg viewBox="0 0 140 50" className="h-9 w-full">
            <circle cx="20" cy="25" r="4" fill="hsl(0, 0%, 13%)" />
            <circle cx="120" cy="25" r="4" fill="hsl(0, 0%, 13%)" />
            <path d="M20,25 Q70,6 120,25" fill="none" stroke="hsl(54, 100%, 45%)" strokeWidth="2.5" />
          </svg>
        );
      case "trp-live":
        return (
          <svg viewBox="0 0 140 50" className="h-9 w-full">
            <circle cx="20" cy="25" r="4" fill="hsl(0, 0%, 13%)" />
            <circle cx="120" cy="25" r="4" fill="hsl(0, 0%, 13%)" />
            <path d="M20,25 Q70,3 120,25" fill="none" stroke="hsl(54, 100%, 45%)" strokeWidth="2.5" />
            <circle cx="70" cy="10" r="3.5" fill="hsl(54, 100%, 45%)" />
          </svg>
        );
      case "field":
        return (
          <svg viewBox="0 0 140 50" className="h-9 w-full">
            <polyline points="10,30 35,18 60,32 85,14 110,28 135,22" fill="none" stroke="hsl(54, 100%, 45%)" strokeWidth="2" />
            {[10, 35, 60, 85, 110, 135].map((x, i) => (
              <circle key={i} cx={x} cy={[30, 18, 32, 14, 28, 22][i]} r="2.5" fill="hsl(0, 0%, 13%)" />
            ))}
          </svg>
        );
      case "taxonomy":
        return (
          <div className="flex gap-4 font-mono text-[11px] tracking-wider uppercase font-medium">
            <span className={consoleData.taxonomyMode === "survive" ? "text-accent" : "text-ink-faint"}>{consoleData.taxonomyMode === "survive" ? "● " : "○ "}survive</span>
            <span className={consoleData.taxonomyMode === "seed" ? "text-accent" : "text-ink-faint"}>{consoleData.taxonomyMode === "seed" ? "● " : "○ "}seed</span>
            <span className={consoleData.taxonomyMode === "defend" ? "text-accent-green" : "text-ink-faint"}>{consoleData.taxonomyMode === "defend" ? "● " : "○ "}defend</span>
          </div>
        );
      case "final":
        return (
          <div className="font-mono text-[12px] font-medium">
            {consoleData.triadA && consoleData.triadB && consoleData.triadC ? (
              <span className="text-accent">
                {consoleData.triadA} ← {consoleData.triadC} → {consoleData.triadB}
              </span>
            ) : (
              <span className="text-ink-faint">awaiting triad…</span>
            )}
          </div>
        );
      default:
        return (
          <svg viewBox="0 0 140 50" className="h-9 w-full">
            <line x1="10" y1="25" x2="130" y2="25" stroke="hsl(var(--ink-faint))" strokeWidth="1" />
            <circle cx="70" cy="25" r="2.5" fill="hsl(0, 0%, 42%)" />
          </svg>
        );
    }
  };

  const renderReadout = () => {
    switch (mode) {
      case "trp-minimal": return "A / B / C";
      case "reference": return `matched: ${consoleData.matchedTargets || "0"}`;
      case "trp-live": return `relation: ${consoleData.trpDescriptor || "active"}`;
      case "field": return `fold state: ${consoleData.foldState || "forming"}`;
      case "stability": return `stable: ${consoleData.stable || "0"} · transient: ${consoleData.transient || "0"}`;
      case "taxonomy": return `mode: ${consoleData.taxonomyMode || "survive"}`;
      case "agency": return `memory: ${consoleData.memoryState || "listening"}`;
      case "final": return consoleData.triadA ? "triad generated" : "awaiting input";
      default: return "—";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 border-2 border-ink-faint bg-background p-4 lg:bottom-6 lg:right-6">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-strong font-semibold">
          Structural Console
        </span>
        <span className="h-2 w-2 bg-accent" />
      </div>
      <div className="mb-3">{renderStage()}</div>
      <div className="border-t-2 border-ink-faint pt-2 font-mono text-[11px] text-ink-strong font-medium">
        {renderReadout()}
      </div>
    </div>
  );
};

export default StructuralConsole;
