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

  // IntersectionObserver for scene tracking
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
      case "calibration":
        return <CalibrationViz />;
      case "banana-scale":
        return <BananaScaleViz />;
      case "trp":
        return <TRPViz />;
      case "fold":
        return <FoldFieldViz />;
      case "stability":
        return <StabilityViz />;
      case "taxonomy":
        return (
          <TaxonomyViz
            onModeChange={(mode) =>
              setConsoleData((prev) => ({ ...prev, taxonomyMode: mode }))
            }
          />
        );
      case "fold-back":
        return <FoldBackViz />;
      case "writes":
        return (
          <FinalViz
            onTriadGenerate={(a, b, c) =>
              setConsoleData((prev) => ({ ...prev, triadA: a, triadB: b, triadC: c }))
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ProgressRail activeScene={activeScene} onSceneClick={scrollToScene} />
      <SceneMarker marker={scene?.marker || ""} />
      <StructuralConsole activeScene={activeScene} consoleData={consoleData} />

      {/* Mobile progress bar */}
      <div className="fixed left-0 top-0 z-50 h-0.5 w-full lg:hidden">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{
            width: `${((SCENES.findIndex((s) => s.id === activeScene) + 1) / SCENES.length) * 100}%`,
          }}
        />
      </div>

      <main className="lg:pl-10">
        {SCENES.map((s) => (
          <section
            key={s.id}
            data-scene={s.id}
            ref={(el) => {
              if (el) sceneRefs.current.set(s.id, el);
            }}
            className="flex min-h-screen items-center px-6 py-16 lg:px-12 lg:py-24"
          >
            <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 lg:grid-cols-[minmax(18rem,32rem)_minmax(24rem,1fr)] lg:gap-16">
              <SceneCopy
                eyebrow={s.eyebrow}
                hero={s.hero}
                plain={s.plain}
                body={s.body}
              />
              <div className="aspect-[3/2] w-full">{renderViz(s.id)}</div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default Index;
