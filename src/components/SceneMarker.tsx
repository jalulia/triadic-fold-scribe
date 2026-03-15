interface SceneMarkerProps {
  marker: string;
}

const SceneMarker = ({ marker }: SceneMarkerProps) => {
  return (
    <div className="fixed left-14 top-6 z-50 hidden items-center gap-2 lg:flex">
      <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
        {marker}
      </span>
    </div>
  );
};

export default SceneMarker;
