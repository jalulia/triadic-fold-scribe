interface SceneMarkerProps {
  marker: string;
}

const SceneMarker = ({ marker }: SceneMarkerProps) => {
  return (
    <div className="fixed left-16 top-6 z-50 hidden items-center gap-3 lg:flex">
      <span className="h-px w-8 bg-ink-medium" />
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-strong font-medium">
        {marker}
      </span>
    </div>
  );
};

export default SceneMarker;
