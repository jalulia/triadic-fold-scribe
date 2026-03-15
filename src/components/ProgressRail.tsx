import { SCENES } from "@/data/scenes";

interface ProgressRailProps {
  activeScene: string;
  onSceneClick: (id: string) => void;
}

const ProgressRail = ({ activeScene, onSceneClick }: ProgressRailProps) => {
  const activeIndex = SCENES.findIndex((s) => s.id === activeScene);

  return (
    <nav
      className="fixed left-0 top-0 z-50 hidden h-screen w-12 flex-col items-center justify-center lg:flex"
      aria-label="Scene progress"
    >
      {/* Vertical spine */}
      <div className="absolute left-6 top-[calc(50%-100px)] h-[200px] w-px bg-border" />

      <div className="relative flex flex-col items-center gap-5">
        {SCENES.map((scene, i) => {
          const isActive = activeScene === scene.id;
          const isPast = i < activeIndex;
          return (
            <button
              key={scene.id}
              onClick={() => onSceneClick(scene.id)}
              className="group relative flex h-3 w-3 items-center justify-center"
              aria-label={scene.marker}
              title={scene.marker}
            >
              <span
                className={`block rounded-full transition-all duration-200 ${
                  isActive
                    ? "h-2.5 w-2.5 bg-foreground"
                    : isPast
                    ? "h-1.5 w-1.5 bg-foreground/40"
                    : "h-1 w-1 bg-foreground/15 group-hover:bg-foreground/30"
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default ProgressRail;
