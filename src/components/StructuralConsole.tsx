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
          <svg viewBox="0 0 120 60" className="h-10 w-full">
            <circle cx="20" cy="30" r="3" className="fill-foreground" />
            <circle cx="100" cy="30" r="3" className="fill-foreground" />
            <path d="M20,30 Q60,10 100,30" fill="none" className="stroke-accent" strokeWidth="1.25" />
          </svg>
        );
      case "trp-live":
        return (
          <svg viewBox="0 0 120 60" className="h-10 w-full">
            <circle cx="20" cy="30" r="3" className="fill-foreground" />
            <circle cx="100" cy="30" r="3" className="fill-foreground" />
            <path d="M20,30 Q60,5 100,30" fill="none" className="stroke-accent" strokeWidth="1.75" />
            <circle cx="60" cy="15" r="2" className="fill-accent animate-pulse-glow" />
          </svg>
        );
      case "field":
        return (
          <svg viewBox="0 0 120 60" className="h-10 w-full">
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={24 * i + 12} y1="10" x2={24 * i + 12} y2="50" className="stroke-ink-faint" strokeWidth="1" />
            ))}
            <polyline points="12,30 36,22 60,35 84,18 108,30" fill="none" className="stroke-accent" strokeWidth="1.25" />
          </svg>
        );
      case "taxonomy":
        return (
          <div className="flex gap-3 font-mono text-[10px] tracking-wider uppercase">
            <span className={consoleData.taxonomyMode === "survive" ? "text-accent" : "text-foreground/30"}>survive</span>
            <span className={consoleData.taxonomyMode === "seed" ? "text-accent" : "text-foreground/30"}>seed</span>
            <span className={consoleData.taxonomyMode === "defend" ? "text-accent-green" : "text-foreground/30"}>defend</span>
          </div>
        );
      case "final":
        return (
          <div className="font-mono text-[10px]">
            {consoleData.triadA && consoleData.triadB && consoleData.triadC ? (
              <span className="text-accent">
                {consoleData.triadA} / {consoleData.triadB} / {consoleData.triadC}
              </span>
            ) : (
              <span className="text-foreground/30">awaiting triad…</span>
            )}
          </div>
        );
      default:
        return (
          <svg viewBox="0 0 120 60" className="h-10 w-full">
            <line x1="10" y1="30" x2="110" y2="30" className="stroke-ink-faint" strokeWidth="1" />
          </svg>
        );
    }
  };

  const renderReadout = () => {
    switch (mode) {
      case "trp-minimal":
        return "A / B / C";
      case "reference":
        return `matched: ${consoleData.matchedTargets || "0"}`;
      case "trp-live":
        return `relation: ${consoleData.trpDescriptor || "active"}`;
      case "field":
        return `fold state: ${consoleData.foldState || "forming"}`;
      case "stability":
        return `stable: ${consoleData.stable || "0"} / transient: ${consoleData.transient || "0"}`;
      case "taxonomy":
        return `mode: ${consoleData.taxonomyMode || "survive"}`;
      case "agency":
        return `memory: ${consoleData.memoryState || "listening"}`;
      case "final":
        return consoleData.triadA ? "generated triad" : "awaiting input";
      default:
        return "—";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-64 border border-ink-faint bg-background/95 p-3 backdrop-blur-sm lg:bottom-6 lg:right-6">
      <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40">
        Structural Console
      </div>
      <div className="mb-2">{renderStage()}</div>
      <div className="font-mono text-[10px] text-foreground/60">{renderReadout()}</div>
    </div>
  );
};

export default StructuralConsole;
