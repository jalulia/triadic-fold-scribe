import { SCENES } from "@/data/scenes";

interface ProgressRailProps {
  activeScene: string;
  onSceneClick: (id: string) => void;
}

const ProgressRail = ({ activeScene, onSceneClick }: ProgressRailProps) => {
  const activeIndex = SCENES.findIndex((s) => s.id === activeScene);

  return (
    <nav
      className="fixed left-0 top-0 z-50 hidden h-screen w-14 flex-col items-center justify-center lg:flex"
      aria-label="Scene progress"
    >
      {/* Vertical spine */}
      <div className="absolute left-7 top-[calc(50%-100px)] h-[200px] w-px bg-ink-faint" />

      <div className="relative flex flex-col items-center gap-5">
        {SCENES.map((scene, i) => {
          const isActive = activeScene === scene.id;
          const isPast = i < activeIndex;
          return (
            <button
              key={scene.id}
              onClick={() => onSceneClick(scene.id)}
              className="group relative flex h-4 w-4 items-center justify-center"
              aria-label={scene.marker}
              title={scene.marker}
            >
              <span
                className={`block transition-all duration-200 ${
                  isActive
                    ? "h-4 w-4 bg-accent shadow-[0_0_12px_hsl(var(--accent-yellow-glow))]"
                    : isPast
                    ? "h-2.5 w-2.5 bg-ink-strong"
                    : "h-2 w-2 bg-ink-faint group-hover:bg-ink-medium"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Active index label */}
      <div className="absolute bottom-8 left-0 w-full text-center">
        <span className="font-mono text-[9px] text-ink-medium font-medium">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
      </div>
    </nav>
  );
};

export default ProgressRail;
