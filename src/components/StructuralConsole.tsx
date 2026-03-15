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
            <circle cx="20" cy="25" r="4" fill="hsl(0, 0%, 4%)" />
            <circle cx="120" cy="25" r="4" fill="hsl(0, 0%, 4%)" />
            <path d="M20,25 Q70,6 120,25" fill="none" stroke="hsl(54, 100%, 50%)" strokeWidth="2.5" />
          </svg>
        );
      case "trp-live":
        return (
          <svg viewBox="0 0 140 50" className="h-9 w-full">
            <circle cx="20" cy="25" r="4" fill="hsl(0, 0%, 4%)" />
            <circle cx="120" cy="25" r="4" fill="hsl(0, 0%, 4%)" />
            <path d="M20,25 Q70,3 120,25" fill="none" stroke="hsl(54, 100%, 50%)" strokeWidth="2.5" />
            <circle cx="70" cy="10" r="3.5" fill="hsl(54, 100%, 50%)" />
          </svg>
        );
      case "field":
        return (
          <svg viewBox="0 0 140 50" className="h-9 w-full">
            <polyline points="10,30 35,18 60,32 85,14 110,28 135,22" fill="none" stroke="hsl(54, 100%, 50%)" strokeWidth="2" />
            {[10, 35, 60, 85, 110, 135].map((x, i) => (
              <circle key={i} cx={x} cy={[30, 18, 32, 14, 28, 22][i]} r="2.5" fill="hsl(0, 0%, 4%)" />
            ))}
          </svg>
        );
      case "taxonomy":
        return (
          <div className="flex gap-4 font-mono text-[11px] tracking-wider uppercase">
            <span className={consoleData.taxonomyMode === "survive" ? "text-accent" : "text-ink-faint"}>survive</span>
            <span className={consoleData.taxonomyMode === "seed" ? "text-accent" : "text-ink-faint"}>seed</span>
            <span className={consoleData.taxonomyMode === "defend" ? "text-accent-green" : "text-ink-faint"}>defend</span>
          </div>
        );
      case "final":
        return (
          <div className="font-mono text-[12px]">
            {consoleData.triadA ? (
              <span className="text-accent">{consoleData.triadA} ← {consoleData.triadC} → {consoleData.triadB}</span>
            ) : (
              <span className="text-ink-faint">awaiting triad…</span>
            )}
          </div>
        );
      default:
        return (
          <svg viewBox="0 0 140 50" className="h-9 w-full">
            <line x1="10" y1="25" x2="130" y2="25" stroke="hsl(var(--ink-faint))" strokeWidth="1" />
          </svg>
        );
    }
  };

  const readoutMap: Record<string, string> = {
    "trp-minimal": "A / B / C",
    reference: `matched: ${consoleData.matchedTargets || "0"}`,
    "trp-live": `relation: ${consoleData.trpDescriptor || "active"}`,
    field: `fold state: ${consoleData.foldState || "forming"}`,
    stability: `stable: ${consoleData.stable || "0"} · transient: ${consoleData.transient || "0"}`,
    taxonomy: `mode: ${consoleData.taxonomyMode || "survive"}`,
    agency: `memory: ${consoleData.memoryState || "listening"}`,
    final: consoleData.triadA ? "triad generated" : "awaiting input",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 border border-ink-faint bg-background p-4 lg:bottom-6 lg:right-6 noise-texture">
      {/* Prismatic top edge */}
      <div className="absolute top-0 left-0 right-0 prismatic-bar" />
      <div className="mt-1 mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-strong">
          Structural Console
        </span>
        <span className="font-display text-[10px] font-bold text-ink-faint">ø</span>
      </div>
      <div className="mb-3">{renderStage()}</div>
      <div className="border-t border-ink-faint pt-2 font-mono text-[11px] text-ink-strong">
        {readoutMap[mode] || "—"}
      </div>
    </div>
  );
};

export default StructuralConsole;
