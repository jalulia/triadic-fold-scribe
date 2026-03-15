// Shared constants for all viz SVGs — IO brand aligned
export const VIZ = {
  // Grid
  gridUnit: 44,
  gridColor: "hsl(37, 6%, 86%)",
  gridStrong: "hsl(37, 6%, 80%)",

  // Ink
  ink: "hsl(0, 0%, 4%)",
  inkStrong: "hsl(0, 0%, 20%)",
  inkMedium: "hsl(0, 0%, 42%)",
  inkFaint: "hsl(37, 6%, 78%)",

  // Accent
  yellow: "hsl(54, 100%, 50%)",
  yellowDim: "hsl(54, 100%, 40%)",
  green: "hsl(151, 100%, 38%)",
  greenDim: "hsl(151, 100%, 30%)",

  // Background (cream)
  bg: "hsl(37, 33%, 94%)",

  // Typography
  mono: "Lekton, monospace",
  display: "Montserrat, sans-serif",
} as const;

// Reusable SVG grid component
export const SvgGrid = ({ w = 600, h = 400 }: { w?: number; h?: number }) => {
  const cols = Math.ceil(w / VIZ.gridUnit) + 1;
  const rows = Math.ceil(h / VIZ.gridUnit) + 1;
  const strongEvery = 4;

  return (
    <>
      {Array.from({ length: cols }, (_, i) => (
        <line
          key={`v${i}`}
          x1={i * VIZ.gridUnit}
          y1="0"
          x2={i * VIZ.gridUnit}
          y2={h}
          stroke={i % strongEvery === 0 ? VIZ.gridStrong : VIZ.gridColor}
          strokeWidth={i % strongEvery === 0 ? 0.75 : 0.5}
        />
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={i * VIZ.gridUnit}
          x2={w}
          y2={i * VIZ.gridUnit}
          stroke={i % strongEvery === 0 ? VIZ.gridStrong : VIZ.gridColor}
          strokeWidth={i % strongEvery === 0 ? 0.75 : 0.5}
        />
      ))}
    </>
  );
};

// Reusable readout panel
export const ReadoutPanel = ({
  x, y, w, h, children,
}: {
  x: number; y: number; w: number; h: number;
  children: React.ReactNode;
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={VIZ.bg} stroke={VIZ.inkFaint} strokeWidth="1" />
    {children}
  </g>
);
