import { useState, useEffect, useRef, useCallback } from "react";
import { SCENES } from "@/data/scenes";
import ProgressRail from "@/components/ProgressRail";
import SceneMarker from "@/components/SceneMarker";
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

  const scrollToScene = useCallback((id: string) => {
    sceneRefs.current.get(id)?.scrollIntoView({ behavior: "smooth" });
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
    <div className="min-h-screen bg-background page-grid noise-texture relative">
      {/* Prismatic top bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] prismatic-bar" />

      <ProgressRail activeScene={activeScene} onSceneClick={scrollToScene} />
      <SceneMarker marker={scene?.marker || ""} />
      <StructuralConsole activeScene={activeScene} consoleData={consoleData} />

      {/* Mobile progress */}
      <div className="fixed left-0 top-[3px] z-50 h-[2px] w-full lg:hidden bg-ink-faint">
        <div className="h-full bg-accent transition-all duration-300"
          style={{ width: `${((SCENES.findIndex((s) => s.id === activeScene) + 1) / SCENES.length) * 100}%` }} />
      </div>

      {/* Ø watermark — IO brand element */}
      <div className="fixed right-[-80px] top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none">
        <span className="font-display text-[320px] font-black text-foreground/[0.02] leading-none">Ø</span>
      </div>

      <main className="relative z-10 lg:pl-14">
        {SCENES.map((s, i) => (
          <section
            key={s.id}
            data-scene={s.id}
            ref={(el) => { if (el) sceneRefs.current.set(s.id, el); }}
            className="relative flex min-h-screen items-center px-6 py-16 lg:px-12 lg:py-20"
          >
            {/* Section divider — IO footer style */}
            {i > 0 && (
              <div className="absolute left-6 right-6 top-0 lg:left-12 lg:right-12">
                <div className="h-px bg-foreground/[0.06]" />
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.08em] text-ink-medium">
                    The Impøssible Outcomes Company
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.08em] text-ink-medium">
                    /{String(s.index).padStart(2, "0")} · ø
                  </span>
                </div>
              </div>
            )}

            <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 lg:grid-cols-[minmax(16rem,26rem)_minmax(28rem,1fr)] lg:gap-16">
              <SceneCopy eyebrow={s.eyebrow} hero={s.hero} plain={s.plain} body={s.body} index={s.index} />
              <div className="relative">
                {/* Viz frame */}
                <div className="absolute -inset-4 border border-foreground/[0.06] pointer-events-none" />
                {/* Corner registration marks */}
                {["-left-4 -top-4 border-l-2 border-t-2", "-right-4 -top-4 border-r-2 border-t-2",
                  "-left-4 -bottom-4 border-l-2 border-b-2", "-right-4 -bottom-4 border-r-2 border-b-2"].map((cls, j) => (
                  <div key={j} className={`absolute ${cls} h-4 w-4 border-foreground/20 pointer-events-none`} />
                ))}
                {/* Figure label */}
                <div className="absolute -top-4 left-6 -translate-y-full pb-1 flex items-center gap-2">
                  <span className="font-mono text-[9px] tracking-[0.08em] text-ink-medium">
                    fig. {String(s.index).padStart(2, "0")}
                  </span>
                  <span className="h-px w-8 bg-ink-faint" />
                </div>
                <div className="aspect-[3/2] w-full bg-background">{renderViz(s.id)}</div>
              </div>
            </div>
          </section>
        ))}

        {/* Footer */}
        <footer className="relative z-10 px-6 py-12 lg:px-12">
          <div className="prismatic-bar mb-6" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.08em] text-ink-medium">
              The Impøssible Outcomes Company
            </span>
            <span className="font-display text-[14px] font-black text-ink-faint">ø</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
