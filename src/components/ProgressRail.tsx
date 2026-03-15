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
      {/* Vertical line */}
      <div className="absolute left-6 top-1/2 h-48 w-px -translate-y-1/2 bg-ink-faint" />

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
                    ? "h-3.5 w-3.5 bg-accent shadow-[0_0_10px_hsla(54,100%,50%,0.4)]"
                    : isPast
                    ? "h-2 w-2 bg-foreground/40"
                    : "h-1.5 w-1.5 bg-ink-faint group-hover:bg-foreground/35"
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
