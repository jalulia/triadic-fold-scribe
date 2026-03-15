import { SCENES } from "@/data/scenes";

interface ConsoleProps {
  activeScene: string;
  consoleData: Record<string, string>;
}

const StructuralConsole = ({ activeScene, consoleData }: ConsoleProps) => {
  const scene = SCENES.find((s) => s.id === activeScene);
  const mode = scene?.consoleMode || "trp-minimal";

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
    <div className="fixed bottom-4 right-4 z-50 w-56 border border-border bg-background/95 backdrop-blur-sm p-3 lg:bottom-6 lg:right-6">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
          Console
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">
          /{String(scene?.index || 1).padStart(2, "0")}
        </span>
      </div>
      <div className="font-mono text-[11px] text-foreground">
        {readoutMap[mode] || "—"}
      </div>
    </div>
  );
};

export default StructuralConsole;
