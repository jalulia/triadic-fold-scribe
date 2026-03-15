import { useState, useEffect, useRef, useCallback } from "react";
import { SCENES } from "@/data/scenes";
import StructuralConsole from "@/components/StructuralConsole";
import SceneCopy from "@/components/SceneCopy";
import CalibrationViz from "@/components/viz/CalibrationViz";
import BananaScaleViz from "@/components/viz/BananaScaleViz";
import TRPViz from "@/components/viz/TRPViz";
import FoldFieldViz from "@/components/viz/FoldFieldViz";
import StabilityViz from "@/components/viz/StabilityViz";
import TaxonomyViz from "@/components/viz/TaxonomyViz";
import FoldBackViz from "@/components/viz/FoldBackViz";
import FinalViz from "@/components/viz/FinalViz";

const Index = () => {
  const [activeScene, setActiveScene] = useState("calibration");
  const [consoleData, setConsoleData] = useState<Record<string, string>>({});
  const sceneRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-scene");
            if (id) setActiveScene(id);
          }
        });
      },
      { threshold: 0.45 }
    );
    sceneRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scene = SCENES.find((s) => s.id === activeScene);

  const renderViz = (sceneId: string) => {
    switch (sceneId) {
      case "calibration": return <CalibrationViz />;
      case "banana-scale": return <BananaScaleViz />;
      case "trp": return <TRPViz />;
      case "fold": return <FoldFieldViz />;
      case "stability": return <StabilityViz />;
      case "taxonomy":
        return <TaxonomyViz onModeChange={(mode) => setConsoleData((p) => ({ ...p, taxonomyMode: mode }))} />;
      case "fold-back": return <FoldBackViz />;
      case "writes":
        return <FinalViz onTriadGenerate={(a, b, c) => setConsoleData((p) => ({ ...p, triadA: a, triadB: b, triadC: c }))} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="max-w-[820px] mx-auto px-6 pt-16 pb-10 border-b border-foreground">
        <div className="flex justify-between items-baseline mb-8">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ink-medium">
            Working Document
          </span>
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ink-medium">
            The Impøssible Outcomes Company
          </span>
        </div>
        <h1 className="text-[2.2rem] font-light tracking-[-0.02em] leading-[1.15] mb-1">
          The Fold That <strong className="font-semibold">Writes</strong>
        </h1>
        <p className="text-[0.88rem] text-ink-medium font-light mb-6">
          Eight structural observations — from reference to recursion.
        </p>
        <p className="text-[0.86rem] text-muted-foreground leading-[1.8] max-w-[520px] italic">
          Each section pairs a concept with an interactive diagram. The diagrams are not illustrations — they are the argument.
        </p>
      </header>

      {/* TOC — sticky nav */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border overflow-x-auto">
        <div className="max-w-[820px] mx-auto px-6 flex">
          {SCENES.map((s) => (
            <button
              key={s.id}
              onClick={() => sceneRefs.current.get(s.id)?.scrollIntoView({ behavior: "smooth" })}
              className={`font-mono text-[0.54rem] uppercase tracking-[0.1em] px-2.5 py-3 whitespace-nowrap transition-colors flex-shrink-0 ${
                activeScene === s.id ? "text-foreground" : "text-ink-faint hover:text-foreground"
              }`}
            >
              {s.eyebrow}
            </button>
          ))}
        </div>
      </nav>

      {/* Sections */}
      <main className="max-w-[820px] mx-auto px-6">
        {SCENES.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            data-scene={s.id}
            ref={(el) => { if (el) sceneRefs.current.set(s.id, el); }}
            className={`py-14 ${i < SCENES.length - 1 ? "border-b border-border" : "border-b border-foreground"}`}
          >
            {/* Section header */}
            <div className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-ink-faint mb-1">
              {String(s.index).padStart(2, "0")}
            </div>
            <h2 className="text-[1.35rem] font-medium tracking-[-0.01em] leading-[1.2] mb-1">
              {s.hero}
            </h2>
            <hr className="border-t border-foreground mt-2 mb-6" />

            {/* Lead */}
            <p className="text-[0.92rem] text-foreground font-normal mb-5 border-l-[3px] border-border pl-4 max-w-[620px]">
              {s.plain}
            </p>

            {/* Body */}
            <p className="text-[0.88rem] text-muted-foreground leading-[1.8] mb-8 max-w-[620px]">
              {s.body}
            </p>

            {/* Diagram */}
            <div className="border border-border bg-secondary">
              <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                <span className="font-mono text-[0.48rem] uppercase tracking-[0.2em] text-ink-faint">
                  Fig. {String(s.index).padStart(2, "0")}
                </span>
                <span className="font-mono text-[0.48rem] uppercase tracking-[0.15em] text-ink-faint">
                  Interactive
                </span>
              </div>
              <div className="aspect-[3/2]">
                {renderViz(s.id)}
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="max-w-[820px] mx-auto px-6 py-10 flex justify-between items-baseline">
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-ink-faint">
          The Impøssible Outcomes Company
        </span>
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-ink-faint">
          2026
        </span>
      </footer>

      {/* Console — minimal readout */}
      <StructuralConsole activeScene={activeScene} consoleData={consoleData} />
    </div>
  );
};

export default Index;
