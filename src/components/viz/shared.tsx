// Shared constants for all viz SVGs — clean document style
export const VIZ = {
  // Ink hierarchy
  ink: "hsl(0, 0%, 7%)",
  inkStrong: "hsl(0, 0%, 20%)",
  inkMedium: "hsl(0, 0%, 33%)",
  inkFaint: "hsl(0, 0%, 67%)",

  // Accent — yellow, used sparingly
  yellow: "hsl(54, 100%, 50%)",
  yellowDim: "hsl(54, 80%, 42%)",
  green: "hsl(151, 100%, 38%)",
  greenDim: "hsl(151, 80%, 30%)",

  // Background
  bg: "hsl(0, 0%, 96%)",
  white: "hsl(0, 0%, 100%)",

  // Rules
  rule: "hsl(0, 0%, 83%)",
  ruleDim: "hsl(0, 0%, 91%)",

  // Typography
  mono: "'Courier Prime', monospace",
  display: "'DM Sans', sans-serif",
} as const;

// Light grid for diagram interiors — subtle dots
export const SvgGrid = ({ w = 600, h = 400 }: { w?: number; h?: number }) => {
  const step = 40;
  const cols = Math.ceil(w / step) + 1;
  const rows = Math.ceil(h / step) + 1;

  return (
    <>
      {Array.from({ length: cols }, (_, c) =>
        Array.from({ length: rows }, (_, r) => (
          <circle
            key={`${c}-${r}`}
            cx={c * step}
            cy={r * step}
            r="0.5"
            fill={VIZ.inkFaint}
            opacity="0.4"
          />
        ))
      )}
    </>
  );
};

// Readout panel
export const ReadoutPanel = ({
  x, y, w, h, children,
}: {
  x: number; y: number; w: number; h: number;
  children: React.ReactNode;
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={VIZ.white} stroke={VIZ.rule} strokeWidth="1" />
    {children}
  </g>
);
