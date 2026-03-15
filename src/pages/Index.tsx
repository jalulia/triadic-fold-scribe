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
    const el = sceneRefs.current.get(id);
    el?.scrollIntoView({ behavior: "smooth" });
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
        return (
          <TaxonomyViz
            onModeChange={(mode) =>
              setConsoleData((prev) => ({ ...prev, taxonomyMode: mode }))
            }
          />
        );
      case "fold-back": return <FoldBackViz />;
      case "writes":
        return (
          <FinalViz
            onTriadGenerate={(a, b, c) =>
              setConsoleData((prev) => ({ ...prev, triadA: a, triadB: b, triadC: c }))
            }
          />
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background page-grid">
      <ProgressRail activeScene={activeScene} onSceneClick={scrollToScene} />
      <SceneMarker marker={scene?.marker || ""} />
      <StructuralConsole activeScene={activeScene} consoleData={consoleData} />

      {/* Mobile progress bar */}
      <div className="fixed left-0 top-0 z-50 h-1 w-full lg:hidden bg-ink-faint">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{
            width: `${((SCENES.findIndex((s) => s.id === activeScene) + 1) / SCENES.length) * 100}%`,
          }}
        />
      </div>

      <main className="relative z-10 lg:pl-14">
        {SCENES.map((s, i) => (
          <section
            key={s.id}
            data-scene={s.id}
            ref={(el) => {
              if (el) sceneRefs.current.set(s.id, el);
            }}
            className="relative flex min-h-screen items-center px-6 py-16 lg:px-10 lg:py-20"
          >
            {/* Section divider */}
            {i > 0 && (
              <div className="absolute left-6 right-6 top-0 lg:left-10 lg:right-10">
                <div className="h-[2px] bg-ink-faint" />
                <div className="mt-3 flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-medium font-medium">
                    Section {String(s.index).padStart(2, "0")} of {String(SCENES.length).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-ink-faint" />
                </div>
              </div>
            )}

            <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 lg:grid-cols-[minmax(16rem,26rem)_minmax(28rem,1fr)] lg:gap-16">
              <SceneCopy
                eyebrow={s.eyebrow}
                hero={s.hero}
                plain={s.plain}
                body={s.body}
                index={s.index}
              />
              <div className="relative">
                {/* Viz frame — structural border with corner registration marks */}
                <div className="absolute -inset-4 border-2 border-ink-faint pointer-events-none" />

                {/* Corner marks */}
                <div className="absolute -left-4 -top-4 h-4 w-4 border-l-[3px] border-t-[3px] border-foreground/25 pointer-events-none" />
                <div className="absolute -right-4 -top-4 h-4 w-4 border-r-[3px] border-t-[3px] border-foreground/25 pointer-events-none" />
                <div className="absolute -left-4 -bottom-4 h-4 w-4 border-l-[3px] border-b-[3px] border-foreground/25 pointer-events-none" />
                <div className="absolute -right-4 -bottom-4 h-4 w-4 border-r-[3px] border-b-[3px] border-foreground/25 pointer-events-none" />

                {/* Frame label */}
                <div className="absolute -top-4 left-6 -translate-y-full pb-1">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-medium font-medium">
                    fig. {String(s.index).padStart(2, "0")}
                  </span>
                </div>

                <div className="aspect-[3/2] w-full bg-background">{renderViz(s.id)}</div>
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default Index;
