import { SCENES } from "@/data/scenes";

interface ProgressRailProps {
  activeScene: string;
  onSceneClick: (id: string) => void;
}

const ProgressRail = ({ activeScene, onSceneClick }: ProgressRailProps) => {
  return (
    <nav
      className="fixed left-0 top-0 z-50 hidden h-screen w-10 items-center justify-center lg:flex"
      aria-label="Scene progress"
    >
      <div className="flex flex-col items-center gap-4">
        {SCENES.map((scene) => {
          const isActive = activeScene === scene.id;
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
                    ? "h-3 w-3 bg-accent shadow-[0_0_8px_hsl(var(--accent-yellow-glow))]"
                    : "h-1.5 w-1.5 bg-ink-faint group-hover:bg-foreground/40"
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
