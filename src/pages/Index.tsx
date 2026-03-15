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
      <ProgressRail activeScene={activeScene} onSceneClick={scrollToScene} />
      <SceneMarker marker={scene?.marker || ""} />
      <StructuralConsole activeScene={activeScene} consoleData={consoleData} />

      {/* Mobile progress — thin, quiet */}
      <div className="fixed left-0 top-0 z-50 h-[2px] w-full lg:hidden bg-border">
        <div className="h-full bg-foreground/40 transition-all duration-300"
          style={{ width: `${((SCENES.findIndex((s) => s.id === activeScene) + 1) / SCENES.length) * 100}%` }} />
      </div>

      <main className="relative z-10 lg:pl-14">
        {SCENES.map((s, i) => (
          <section
            key={s.id}
            data-scene={s.id}
            ref={(el) => { if (el) sceneRefs.current.set(s.id, el); }}
            className="relative flex min-h-screen items-center px-6 py-16 lg:px-12 lg:py-20"
          >
            {/* Quiet section divider */}
            {i > 0 && (
              <div className="absolute left-6 right-6 top-0 lg:left-12 lg:right-12">
                <div className="h-px bg-border" />
              </div>
            )}

            <div className="mx-auto grid w-full max-w-[1280px] items-center gap-10 lg:grid-cols-[minmax(16rem,24rem)_minmax(28rem,1fr)] lg:gap-16">
              <SceneCopy eyebrow={s.eyebrow} hero={s.hero} plain={s.plain} body={s.body} index={s.index} />
              <div className="relative">
                {/* Figure label — small, mono, scientific */}
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                    fig. {String(s.index).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="aspect-[3/2] w-full border border-border bg-background">
                  {renderViz(s.id)}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Footer — minimal */}
        <footer className="relative z-10 px-6 py-10 lg:px-12">
          <div className="h-px bg-border mb-4" />
          <span className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground">
            The Impøssible Outcomes Company
          </span>
        </footer>
      </main>
    </div>
  );
};

export default Index;
