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
    field: `fold: ${consoleData.foldState || "forming"}`,
    stability: `stable ${consoleData.stable || "0"} · transient ${consoleData.transient || "0"}`,
    taxonomy: `${consoleData.taxonomyMode || "survive"}`,
    agency: `${consoleData.memoryState || "listening"}`,
    final: consoleData.triadA ? "triad generated" : "awaiting input",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 border border-border bg-background px-3 py-2 flex items-center gap-3">
      <span className="font-mono text-[0.48rem] uppercase tracking-[0.2em] text-ink-faint">
        {String(scene?.index || 1).padStart(2, "0")}
      </span>
      <span className="w-px h-3 bg-border" />
      <span className="font-mono text-[0.65rem] text-muted-foreground">
        {readoutMap[mode] || "—"}
      </span>
    </div>
  );
};

export default StructuralConsole;
