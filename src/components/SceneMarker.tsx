interface SceneMarkerProps {
  marker: string;
}

const SceneMarker = ({ marker }: SceneMarkerProps) => {
  return (
    <div className="fixed left-14 top-6 z-50 hidden font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/50 lg:block">
      {marker}
    </div>
  );
};

export default SceneMarker;
